import uniqid from 'uniqid'
import { elements } from '../views/base';

export default class List {
  constructor() {
    this.items = [];
  }

  addItem (count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    }
    this.items.push(item);
    return item;
  }

  deleteItem(id) {     //items are created by addItem
    const index = this.items.findIndex(el => el.id === id);//retunr index
    // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
    // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
    this.items.splice(index, 1); //delte one elem 1(pos, amount)
  }

  updateCount(id, newCount) {// people eat
    this.items.find(el => el.id === id).count = newCount; //return elem
                                  //elem with prop count = newCount;
  }  
}