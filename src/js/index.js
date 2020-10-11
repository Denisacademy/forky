import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from './views/base';

//console.log(elements);
//Global State
/**
 -Search object
*- Current recipe obj
*-Shopping list obj
*-Liked recipes
**/

const state = {};
window.state = state;

/**SEARCH CONTROLLER */
const controllerSearch = async () => { //btn search
  // 1) get query from view
  const query = searchView.getInput(); //todo //value
  //const query = 'pizza';

  if(query) {
    // 2) new Search obj and add to state
    state.search = new Search(query);
    
    // 3) Prepare UI for res
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();//return promise
      //console.log(state.search.result)
      
      // 5) render result on UI
      clearLoader();
      //searchView.renderResults(state.search.result);//from module
      searchView.renderResults(state.search.result);//from module
  } catch (error) {
      alert('stm went wrong with the search');
      clearLoader();
    }
  }
};




elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();//reset standart behave
  controllerSearch();
});


// TESTING
// window.addEventListener('load', e => {
//   e.preventDefault();//reset standart behave
//   controllerSearch();
// });

elements.searchResPages.addEventListener('click', e => {
  
  //console.log(e.target);
  const btn = e.target.closest('.btn-inline');// return elem if click is on arrow
  //console.log(btn);
  if (btn) {
    const goTopage = parseInt(btn.dataset.goto, 10); //get data attr
    searchView.clearResults();
    searchView.renderResults(state.search.result, goTopage);//from module
  }
});


/* RECIPE CONTROLLER */

// const r  = new Recipe(46956);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
  // Get id from url
  const id = window.location.hash.replace('#', '');
  //console.log(id);
  
  if(id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Hightlight selected searc item
    //console.log(id);
    var sec = window.location.hash.replace('#', ' ');
    //console.log(sec);

    //if(state.search) searchView.hightLightSelected(id);
    //if(state.search) searchView.showId(id);
    //debugger
    //console.log(document.querySelector(`a[href*="${id}"]`));
    if(state.search) searchView.highlightSelected(id);
    //searchView.hightLightSelected(id);
    //searchView.showId(id);


    // Create new recipe object
    state.recipe = new Recipe(id);
    
    // TESTING
    window.r = state.recipe;
    window.v = recipeView
    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      //console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      //console.log(state.recipe.ingredients);
      clearLoader();
      //console.log(state.recipe)
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      
      );//mod method state
    } catch(error) {
        alert('Error processing recipe');
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // by def get data
window.serv = state;

/* LIST CONTROLLER */
const controlList = () => {
  //create a new list if there in none yet
  if(!state.list) state.list = new List();
  
  //Add each ingrediens to the list and UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    
    listView.renderItem(item); ///RENDER ITEM ****
  });
}

// handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid; // specific id
  console.log(id);
  // handle the delete button 
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    
    //Delete from state
    state.list.deleteItem(id);

    //Delete from UI
    //debugger
    listView.deleteItem(id);


    //handle the count update
  } else if(e.target.matches('.shopping__count-value')) {
      const val = parseFloat(e.target.value, 10) //value select
      state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id

  // USer has NOT yet liked current recipe
  if(!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID, 
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
      likesView.toggleLikeBtn(true);  //up like
    // Add like to UI list
    likesView.renderLike(newLike);
      console.log(state.likes);
  // User has HAS liked current recipe
  } else {
    // Remove like from the state
      state.likes.deleteLike(currentID);
    // Toggle the like button
      likesView.toggleLikeBtn(false)
    // Remove like from UI list
      console.log(state.likes);
      likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
}
// Restore liked recipes on 
window.addEventListener('load', () => { // after loading fill favourite list
 state.likes = new Likes();
 // Restore likes
 state.likes.readStorage();

 //Toggle like menu button
 likesView.toggleLikeMenu(state.likes.getNumLikes());

 // Render the exisiting likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

// Handling recipe button clicks //
elements.recipe.addEventListener('click', e => { //matches return true and closest return elem  
   if(e.target.matches('.btn-decrease, .btn-decrease *')) { // use asteriks to correctly click button! any child another way of delagation ????
    console.log(e.target);
    //Decraese butt clicked   //lok for children of parent element
    if (state.recipe.servings > 1) { //if greater than 1 let`s decrease
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe); // update DOM
    }
    //state.recipe.updateServings('dec');
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //Decraese butt clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);

   } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
     console.log('add recipe');
     elements.shopping.innerHTML = ''; //!!!!!!!!!
     // Add ingredients to shopping list
     controlList();
   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
     //like controller
     controlLike();
   }
   //console.log(state.recipe);
})

//console.log(state);

//const l = new List();
window.l = new List();









//https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/9939920#questions/10677578
//https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/9939920#questions/10262548
//https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/9939920#questions/8667232
const div = [10, 100, 1000, 10000]; // 2.36 = 2 9/25
const multHunder = [2, 4, 8]; // 3 7 4 
const fn = [3, 4, 7, 9]; //2.18 []
const ifAfterDotIsZero = [1, 3, 2];
const numDec = 2.18;
function transDec(num) {
    var cut = +num.includes('.') ? +num.split(''): num;
    cut = cut % 2 === 0;
    if(cut) {

    }
}

/*
document.querySelector('.recipe').addEventListener('click', event => { //dont work
  if(event.target.matches('.btn-decrease *')) {
      document.querySelectorAll('.recipe__item').forEach(el => {
         var st = ["style"]['backgroundColor'];    
         st.st = st.st === 'red' ? 'blue' : 'red';
      })
  }
})
*/
//transDec(numDec);

function sayMeOperations(str) {
  let strNew = str.split(' ');
  let strEnd= [];
  for ( let i = 2; i < strNew.length; i ++) {
      if ( +strNew[i - 2] +  +strNew[i - 1] == strNew[i]) {
          strEnd.push('addition');
      } else if ( strNew[i - 2] - strNew[i - 1] == strNew[i]) {
          strEnd.push('subtraction');
      } else if (strNew[i - 2] * strNew[i - 1] == strNew[i])  {
          strEnd.push('multiplication');
      } else {
          strEnd.push('division');
      }
  }
  return strEnd.join(', ');
}