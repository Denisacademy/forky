import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView'
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
      console.log(state.search.result)
      
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

elements.searchResPages.addEventListener('click', e => {
  
  console.log(e.target);
  const btn = e.target.closest('.btn-inline');// return elem if click is on arrow
  console.log(btn);
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
  console.log(id);
  if(id) {
    // Prepare UI for changes
        
    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data
      await state.recipe.getRecipe();

      // Calculate serving and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      console.log(state.recipe);
    } catch(error) {
      alert('Error processing recipe');
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe)); // by def get data