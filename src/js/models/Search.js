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

