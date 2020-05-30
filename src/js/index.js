// // Global app controller

import Search from "./models/Search";

import * as searchView from "./views/searchView";

import { elements, renderLoader, clearLoader } from "./views/base";

//global state of the app
/*
    search object 
    current recipe object
    shopping list object
    liked recipes

*/

// event listeners going in the controller

const state = {};

const controlSearch = async () => {
    //1. get the query from the view
    
    const query = searchView.getInput();
    console.log(query)

    if (query) {
        //2) New search object and add to state
        state.search = new Search(query);

    };

    //3) prepare Ui for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)
    //4 search for recipes

    await state.search.getResults();

    // render results on UI
    clearLoader();

    searchView.renderResults(state.search.result)
};

document.querySelector(".search").addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

// const search = new Search("pizza");

// console.log(search)

// search.getResults();

