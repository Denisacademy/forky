import Search from './models/Search';
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

const controllerSearch = async () => { //btn search
  // 1) get query from view
  const query = searchView.getInput(); //todo

  if(query) {
    // 2) new Search obj and add to state
    state.search = new Search(query);
    
    // 3) Prepare UI for res
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);


    // 4) Search for recipes
    await state.search.getResults();//return promise

    // 5) render result on UI
    clearLoader();
    searchView.renderResults(state.search.result);//from module
  }
}


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


