// // Global app controller

import Search from "./models/Search";

import Recipe from "./models/Recipe";

import List from "./models/List";

import Likes from "./models/likes";

import * as recipeView from "./views/recipeView";

import * as searchView from "./views/searchView";

import * as listView from "./views/listView";

import * as likesView from "./views/likesView";

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

    if (id) {
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item

        if (state.search)
        {searchView.highlightSelected(id)};

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

        clearLoader();
       recipeView.renderRecipe(
           state.recipe,
           state.likes.isLiked(id)
           );
       } catch (err) {
           console.log(err)
            alert("Error processing recipe!")
       }
    };
};

["hashchange", "load"].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */
    const controlList = () => {
        // Create a list if there is none yet
        if (!state.list) state.list = new List();
        //Add each ingredient to the list and userInterface

        state.recipe.ingredients.forEach(el => {
            
          const item = state.list.addItem(el.count, el.unit, el.ingredient);
      
          listView.renderItem(item)
        });
    };

//Handle delete and update list item events

elements.shopping.addEventListener("click", e => {
    
    const id = e.target.closest(".shopping__item").dataset.itemid;
    
    //Handle the delete button

    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
        //Delete from state
            
            state.list.deleteItem(id);
        //delete from ui
            listView.deleteItem(id);
        
            //Handle the count update
    } else if (e.target.matches(".shopping__count-value")) {
        const val = parseFloat(e.target.value, 10);

        state.list.updateCount(id, val)
    };

});

/**
 * Like Controller
 */


const controlLike = () => {
    
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has  not yet liked current recipe 

    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        
        //Toggle the like button
        
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);
         
    //User has liked the current recipe 
    } else{
        //Remove like to the state
            state.likes.deleteLike(currentID);
        
            //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like to UI list
        likesView.deleteLike(currentID);
    };
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipe on page load

window.addEventListener("load", () => {
    state.likes = new Likes();
    //Restore like
    state.likes.readStorage();
    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    //render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", e => {

    if (e.target.matches(".btn-decrease, .btn-decrease *") ) {
        //Decrease button is clicked
        if (state.recipe.servings > 1){
        state.recipe.updateServings("dec");
        recipeView.updateServingsIngrediensts(state.recipe)
        }
    } else if (e.target.matches(".btn-increase, .btn-increase *") ) {
            //increase button is clicked   
        state.recipe.updateServings("inc");
        recipeView.updateServingsIngrediensts(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //Add to list button
        controlList();
    } else if (e.target.matches(".recipe__love, .recipe__love *")){
        //Like controller 
        controlLike();
    } 
});
