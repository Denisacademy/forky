import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { //???
  elements.searchInput.value = '';
}

export const clearResults = () => {
  elements.searchResList.innerHTML = ''; 
  elements.searchResPages.innerHTML = '';
}

/*
// Pasta with tomato and spinach
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 5 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 5 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']

*/
const limitRecipeTitle = (title, limit = 23) => { //cut tutle into array
  const newTitle = [];
  if(title.length > limit) {
    title.split(' ').reduce((acc, current) => { //"The Best Lasagna Ever" = ["The", "Best", "Lasagna", "Ever"]
      if(acc + current.length <= limit) {//0 + 5 <= 17-> push [pasta]
        newTitle.push(current);
      }
      return acc + current.length;
    }, 0);

    //return the result 
    return `${newTitle.join('')}...`;//passta with tomato...
  }
  return title;
} 

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage); // 
  let button;
  if (page === 1 && pages > 1) {
    //button to go to the next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    //both buttons
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, 'prev');
  }

  elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};


export const renderResults = (recipes, page = 2, resPerPage = 5) => {
  // render results of current page
  console.log(recipes);
  const start = (page - 1) * resPerPage; //0 *10// 1 * 10
  const end = page * resPerPage; //1 *10 // 2 * 10
               //0 10// 10 20//
  recipes.slice(start, end).forEach(renderRecipe); //array push each of element
  
  // render pagination
  renderButtons(page, recipes.length, resPerPage);
}