import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { //???
  elements.searchInput.value = '';
}

export const clearResults = () => {
  elements.searchResList.innerHTML = ''; 
  elements.searchResPages.innerHTML = '';
}

/*==========Select elem
  //var hash = window.location.hash.replace('#', '')
  //document.querySelector(`a[href*="${hash}"]`).classList.add('results__link--active')
  //document.querySelector(`a[href*="54454"]`).classList.add('results__link--active')
=====*/

//export const showId = id => console.log(id);


export const highlightSelected  = id => { //=== get elements with .results__link;
  Array.from(document.querySelectorAll('.results__link')).forEach(el => el.classList.remove('results__link--active'))
   
  //console.log(id);
  //console.log(document.querySelector(`a[href*="${id}"]`));
  //console.log(id);
  //var cur = document.querySelector(`a[href*="2ec050"]`)//.classList.add('results__link--active');
  //console.log(cur);
  document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active'); //*?
  //document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');

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

// type: 'prev' or 'next'             //return button
const createButton = (page, type) => ` 
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

                      //1     recipes.length  5
const renderButtons = (page, numResults, resPerPage) => {//!!!!!
  console.log("Redn " + page , numResults, resPerPage);
  //console.log(recipes, page, resPerPage);
  const pages = Math.ceil(numResults / resPerPage); // number of pages (28 / 5 = r(6))
  let button;
  if (page === 1 && pages > 1) {//page def = 1  page === 1 && 
    //button to go to the next page
    button = createButton(page, 'next');
  } else if (page < pages) { //1 < 6
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


export const renderResults = (recipes, page = 1, resPerPage = 7) => {
  // render results of current page
  const start = (page - 1) * resPerPage; //0 *10// 1 * 10 (2-1 * 5 = 5)(3 - 1 * 5 = 10)
  const end = page * resPerPage; //1 *10 // 2 * 10   //0 10// 10 20//
  recipes.slice(start, end).forEach(renderRecipe); //array push each of element
  //console.log(page, recipes.length, resPerPage);// 1 28 5
  // render pagination // page = page 1  recipes.length = numResults resPag = resPage = 5
  renderButtons(page, recipes.length, resPerPage);//2
  //renderButtons(recipes.length, resPerPage, page);//2

}