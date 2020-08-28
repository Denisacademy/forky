import axios from 'axios'

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      //this.result = res.data.recipes;
    } catch (error) {
      //console.log(error);
      alert(`smth went wrong :(`);
    }
  }

  parseToNumber(a, frac) { //'1-1/3
    console.log(a);
    var re = /\-/;
    var ind = a.match(re).index;
    
    var obj = {};
    obj.left = +a.slice(0, ind);
    obj.right = a.slice(ind + 1)
    
    obj.ld = parseInt(obj.right);
    obj.rd = a.match('/').index;
    obj.rd = a.slice(obj.rd + 1)
    console.log(obj);
    return obj.left + (+(obj.ld / obj.rd).toFixed(frac))
}

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  calcServings() {
    this.servings = 4;
  }
  parseIngredients() {
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g']// == ['tbsp', 'tbsp', 'oz', 'oz', 'kg', 'g']

    const newIngredients = this.ingredients.map(el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
                                        // *\( [exc ^)]* \* )]

      // 3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

      let objIng; 

      if (unitIndex > -1) {
        // there is a unit
        // Ex. 4 and 1/2 cups, arrCount is [4, 1/2] --> "4+1/2";
        // Ex. 4 cups, arrCount is [4];
        const arrCount = arrIng.slice(0, unitIndex); 
        //console.log(arrCount + ' xex');
        let count;
        if (arrCount.length === 1) {//!!!!!

          //count = eval(arrIng[0].replace('-', '+')).toFixed(2);
          
          //count = parseToNumber(arrIng[0], 2);
          
          /*===my==*/
          //console.log(parseToNumber(arrIng[0], 2));
          //console.log(typeof arrIng[0]);
          //var xex = arrIng[0];
          

          count = arrIng[0].replace('-', '+').split(' ');
          //console.log(arrIng);
          count =  eval(arrIng[0].replace('-', '+'));

          //count = String(count).length > 3 ? +count.toFixed(2) : count = count;
          //console.log(count + ' xex');
          //window.ct = count;  
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        };

      } else if (parseInt(arrIng[0], 10)) { //return number
        // There is no Unit, but 1st el is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // there is no unit and No number in 1st pos;
        objIng = {
          count: 1,
          unit: '',
          ingredient  //assign ingredient.split(' ');
        }
      }

      return objIng;

    });
    this.ingredients = newIngredients;
  }

  updateServings (type) {//btn dec / inc
    // Servings                                 4 - 1 = 3
    const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;
    
    //Ingredients
    this.ingredients.forEach(ing => {   //this.servings - property which appeared after fetchiing
      ing.count *= (newServings / this.servings); //ing.count = ing.count * new / this.ser
    });

    this.servings = newServings;
  }
}