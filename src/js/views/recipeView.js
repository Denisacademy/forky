import { elements } from './base';
//import { Fraction } from 'fractional'; //plugin
import fracty from 'fracty';
console.log(fracty(4 + 2.05));


// const formatCount = count => {
//   if (count) {
//     //count = 2.5 -->5/2 --> 2 1/2
//     //count = 0.5 --> 1/2
//     const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10)); //define 2 variable 
//     if (!dec) return `${fracty(count)}`;

//     if (int === 0) {
//       const fr = fracty(count);
//       console.log(fr);
//       return fr / fr;
//     } else {
//       const fr = fracty(count - int);
//       return `${int} ${fr} / ${fr}`;
//     }

//   }
//   return '?';
// }

const formatCount = count => {
  if (count) {
    return `${fracty(count)}`;
  }
  return '?';
};


export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
}

//return LI
const createIngredient = ingredient => ` 
        <li class="recipe__item">
          <svg class="recipe__icon">
              <use href="img/icons.svg#icon-check"></use>
          </svg>
          <div class="recipe__count">${formatCount(ingredient.count)}</div>
          <div class="recipe__ingredient">
              <span class="recipe__unit">${ingredient.unit}</span>
              ${ingredient.ingredient}
          </div>
        </li>
`;
         //return mass ["<li>1</li>", "<li>3</li>", "<li>5</li>", "<li>7</li>"].join() = one string
export const renderRecipe = (recipe, isLiked) => { // ${recipe.ingredients.map(el => createIngredient(el))}
  const markup = `
    <figure class="recipe__fig">
      <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
      <h1 class="recipe__title">
          <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-stopwatch"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
          <span class="recipe__info-text"> minutes</span>
      </div>
      <div class="recipe__info">
          <svg class="recipe__info-icon">
              <use href="img/icons.svg#icon-man"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
          <span class="recipe__info-text"> servings</span>

          <div class="recipe__info-buttons">
              
              <button class="btn-tiny btn-decrease">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-minus"></use>
                  </svg>
              </button>

              <button class="btn-tiny btn-increase">
                  <svg>
                      <use href="img/icons.svg#icon-circle-with-plus"></use>
                  </svg>
              </button>

          </div>

      </div>
      <button class="recipe__love">
          <svg class="header__likes">
              <use href="img/icons.svg#icon-heart${isLiked ? '': '-outlined'}"></use>
          </svg>
      </button>
    </div>



      <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
          ${recipe.ingredients.map(el => createIngredient(el)).join('')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
      </div>

      <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
      </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients  = recipe => { //comes from state ctrl 
  //Update servings
  document.querySelector('.recipe__info-data--people').textContent = recipe.servings; //people el

  //Update ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count')); //1 2/3 cup 1 7/8
  //debugger
  //console.log('smth');
  //console.log(countElements);
  countElements.forEach((el, i) => {   
    //console.log(el);
    //debugger
                   // parametr of function (recipe)
    el.textContent = formatCount(recipe.ingredients[i].count);
    /*w.serv.recipe.ingredients[0] = [{count: 1.33, unit: "cup", ingredient: "shortening "}] 
    */
  }) 
};


