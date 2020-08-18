import Search from './models/Search';

//Global State
/**
 -Search object
*- Current recipe obj
*-Shopping list obj
*-Liked recipes
**/

const state = {

};

const controllerSearch = async () => {
  // 1) get query from view
  const query = 'pizza'; //todo

  if(query) {
    // 2) new Search obj and add to state
    state.search = new Search(query);
    
    // 3) Prepare UI for res
    
    // 4) Search for recipes
    await state.search.getResults();

    // 5) render result on UI
    console.log(state.search.result);
  }
}

document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();//resest stand behave
  controllerSearch();

});

console.log(state);
//console.log(new Search('pizza').getResults());



