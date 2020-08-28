import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
      recipeView.renderRecipe(state.recipe);//mod method state
    } catch(error) {
      alert('Error processing recipe');
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // by def get data
window.serv = state;

// Handling recipe button clicks //
elements.recipe.addEventListener('click', e => { //matches return true and closest return elem  
   if(e.target.matches('.btn-decrease, .btn-decrease *')) { // use asteriks to correctly click button! any child another way of delagation ????
    console.log(e.target);
    //Decraese butt clicked   //lok for children of parent element
    if (state.recipe.servings > 1) { //if greater than 1 let`s decrease
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    //state.recipe.updateServings('dec');
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //Decraese butt clicked
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);

   }
   //console.log(state.recipe);
})

//console.log(state);


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