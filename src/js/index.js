// // Global app controller

import Search from "./models/Search";

import Recipe from "./models/Recipe";

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

/*
    *Search Controller

*/

const controlSearch = async () => {
    //1. get the query from the view
    
    const query = searchView.getInput();
    
    //testing

    // const query = "pizza";

    if (query) {
        //2) New search object and add to state
        state.search = new Search(query);

    };

    //3) prepare Ui for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes)
    //4 search for recipes
    try {
    await state.search.getResults();

    // render results on UI
    clearLoader();

    searchView.renderResults(state.search.result);
    } catch (err) {
        alert("Something went wrong with the search ...");
        clearLoader();
    };
};

elements.searchForm.addEventListener("submit", e => {
    e.preventDefault();
    controlSearch();
});

//For testing

 
// window.addEventListener("load", e => {
//     e.preventDefault();
//     controlSearch();
// });   

elements.searchResPages.addEventListener("click", e => {

    const btn = e.target.closest(".btn-inline");
    
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
       
    }
});

/*Recipe controller*/

const controlRecipe = async () => {
    //Get id from url
    const id = window.location.hash.replace("#", "")
  //  console.log(id);


    if (id) {
        //prepare ui for changes

        //create new recipe object

        state.recipe = new Recipe(id);

        //testing////////////////////////////////////////
        // window.r = state.recipe;

        //get recipe data and parse ingredients
       try {
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        
        //calculate servings and time

        state.recipe.calcTime();
        state.recipe.calcServings();

        //render recipe

        console.log(state.recipe)
       } catch (err) {
            alert("Error processing recipe!")
       }
    };
};

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));












// const search = new Search("pizza");

// console.log(search)

// search.getResults();

