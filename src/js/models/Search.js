// export default "I am an exported string.";

//es6 clases to describr the data for the search

import axios from "axios";

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults() {

        //? is to add 
        try {
        const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
        
            //we want the recipes to be saved in the object
        this.result = res.data.recipes;
    
       // console.log(this.result)
        } catch (error) {
            alert(error)
        }
    }
}

