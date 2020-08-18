import Search from './models/Search';
import * as searchView from './views/searchView'
import { elements } from './views/base';
//console.log(elements);
//Global State
/**
 -Search object
*- Current recipe obj
*-Shopping list obj
*-Liked recipes
**/

const state = {};

const controllerSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput(); //todo
  console.log(query);

  if(query) {
    // 2) new Search obj and add to state
    state.search = new Search(query);
    
    // 3) Prepare UI for res
    searchView.clearInput();
    searchView.clearResults();
    
    // 4) Search for recipes
    await state.search.getResults();

    // 5) render result on UI
    //console.log(state.search.result);
    console.log(state);
    //state.forEach(el => console.log(el));
    searchView.renderResults(state.search.result);
  }
}

//onsole.log(state)

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();//reset standart behave
  controllerSearch();

});

//console.log(new Search('pizza').getResults());



