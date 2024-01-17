import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import BookmarksViewView from './views/resultsView.js';
import 'core-js/stable'; //for ployfiling
import 'regenerator-runtime/runtime'; //for async/await
import AddRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

/* Controller purpose ⚠️:
//   Think of the Controller as the logic behind the scenes that makes things 
//   happen when you interact with the View. It's like the person or the code 
//   that takes your input from the interface (like clicking a button to borrow a book) 
//   and decides what should happen next.  */

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////////////////////////////////////////////////

/**
 * Controller function for handling recipes.
 * This function is responsible for loading and rendering a recipe based on the URL hash.
 * @returns {Promise<void>} A Promise that resolves when the recipe is loaded and rendered.
 */
const controlRecipes = async function () {
  try {
    //Extract the Recipe id from the window location hash
    const id = window.location.hash.slice(1);

    // Guard clause: If there is no id, exit the function
    if (!id) return;

    // Display a spinner animation while loading the recipe
    recipeView.renderSpinner();

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading recipe
    await model.loadRecipe(id); // This async function doesn't return anything but manipulates the state data

    // 2. Render the recipe view using the loaded recipe data
    recipeView.render(model.state.recipe); // Passes the recipe data(model.state.recipe) to the render() method to display the recipe.
  } catch (err) {
    // Handle errors by showing an alert with the error message
    // console.log(err);

    // Render error message
    recipeView.renderError();
    // console.log(err);
  }
};
// Call the controlRecipes function to initiate the process
controlRecipes();

/**
 * Async function that renders the searched results to the DOM aswell as the pagination buttons
 * @returns {Promise<void>} - A promise that resolves when the search results are handled.
 */
const controlSearchResults = async function () {
  try {
    // Gets query/Search recipe from the DOM
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // we dont store this as it doenst return anything it manupulates the model state
    await model.loadSearchResults(query);

    // render search results //
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    //Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Control / render pagination of search results.
 * @param {number} goToPage - The page number to navigate to.
 */
const controlPagination = function (goToPage) {
  // console.log('Pag controller' + goToPage);

  // Renders the search results for the specified page.
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Updates pagination buttons based on the current state of the search.
  paginationView.render(model.state.search);
};

/**
 * Controller function for updating the serving size of a recipe.
 *
 * @param {*} newServings - The new serving size for the recipe.
 */
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

/**
 * Controller function for adding or removing a bookmark for the current recipe.
 */
const controlAddBookmark = function () {
  // Check if the current recipe is not bookmarked
  if (!model.state.recipe.bookmarked) {
    // If not bookmarked, add the recipe to bookmarks
    model.addBookmark(model.state.recipe);
  } else {
    // If already bookmarked, delete the recipe from bookmarks
    model.deleteBookmark(model.state.recipe.id);
  }

  // Update the view to reflect the changes in bookmark status
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Controller function for rendering bookmarked recipes.
 */
const controllBookmarks = function () {
  // Render the bookmarks using the bookmarksView and the current state's bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);
    // Renders the newly created recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      // addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const starterMessage = function () {
  console.log('Welcome to the program');
};

/**
 * Initialize the application.
 */
const init = function () {
  bookmarksView.addHandlerRender(controllBookmarks);
  // Call the 'addHandlerRender' method of 'recipeView' and pass 'controlRecipes' as a handler.
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // Call the 'addHandlerSearch' method of 'searchView' and pass 'controlSearchResults' as a handler.
  searchView.addHandlerSearch(controlSearchResults);
  // Call the 'addHandlerClick' method of 'paginationView' and pass 'controlPagination' as a handler.
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  starterMessage();
};
// Invoke the initialization function to set up the application.
init();
