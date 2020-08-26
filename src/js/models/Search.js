import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = res.data.recipes; // create property 'result'
            
            // FETCH
            // const response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            // const res = await response.json();
            // this.result = res.recipes;
                                   

            //.then(response => response.json())
            //.then(json => console.log(json))
            //this.result = await response.json();
            //console.log(this.result.recipes);
            
        } catch (error) {
            alert(error);
        }
    }

}


// const div = [10, 100, 1000, 10000]; // 2.36 = 2 9/25
// const mult = [2, 4, 8];
// const numDec = 2.18;
// function transDec(num) {
//     var cut = +num.includes('.') ? +num.split(''): num;
//     console.log(cut);
// }

