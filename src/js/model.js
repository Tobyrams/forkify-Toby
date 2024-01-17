// The Model represents the application's data(state) and business logic.

import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

//This contains the needed to run the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Create a structured recipe object from raw data.
 *
 * @param {*} data - Raw recipe data from the API response.
 * @returns {*} - A structured recipe object.
 */
const createRecipeObject = function (data) {
  // Destructure the recipe data from the API response
  const { recipe } = data.data;

  // Create and return a structured recipe object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Fetches the data from the forkify API and updates the state.recipe{} Object.
 * @param {string} id - Recipe hash without the #, e.g., (5ed6604591c37cdc054bcac4).
 */
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe); // Data stored in the state Object ln 4
  } catch (err) {
    console.error(`${err}💥💥`);
    // THis propergate the error to the controller so that we can handle it there
    throw err;
  }
};

/**
 * Asynchronous function to load search results from the API based on the provided query.
 *
 * @param {*} query - The search query.
 */
export const loadSearchResults = async function (query) {
  try {
    // Update the application state with the current search query
    state.search.query = query;

    // Fetch data from the API using the getJSON function
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);

    // Map the retrieved data to a simplified format and update the search results in the application state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // Sets the page back to 1 so that when we serach for different recipe it starts at page 1
    state.search.page = 1;
  } catch (err) {
    // Log and rethrow the error for handling in the controller
    console.error(`${err}💥💥`);
    throw err;
  }
};

/**
 * Get a specific page of search results.
 * @param {number} page - The page number to retrieve.
 * @returns {Array} - An array containing search results for the specified page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // Calculate the start and end indices for the current page.
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // Return a slice of the search results array for the specified page.
  return state.search.results.slice(start, end);
};

/**
 * Update the servings of a recipe and adjust ingredient quantities accordingly.
 *
 * @param {*} newServings - The new serving size for the recipe.
 */
export const updateServings = function (newServings) {
  // Loop through each ingredient in the recipe
  state.recipe.ingredients.forEach(ing => {
    // Calculate the new quantity for each ingredient based on the new serving size
    // Formula: newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // Update the recipe's serving size to the new value
  state.recipe.servings = newServings;
};

/**
 *  Storing the bookmarks into the local storage
 * @param {*} recipe
 */
const presistBookmarks = function (recipe) {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Add a recipe to the list of bookmarks.
 *
 * @param {*} recipe - The recipe to be added to bookmarks.
 */
export const addBookmark = function (recipe) {
  // Add the provided recipe to the list of bookmarks in the state
  state.bookmarks.push(recipe);

  // Mark the current recipe as bookmarked if its id matches the added recipe's id
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmarks();
};

/**
 * Delete a bookmarked recipe from the list of bookmarks.
 *
 * @param {*} id - The id of the recipe to be removed from bookmarks.
 */
export const deleteBookmark = function (id) {
  // Find the index of the bookmarked recipe in the state's bookmarks array
  const index = state.bookmarks.findIndex(el => el.id === id);

  // Remove the recipe from the bookmarks array using its index
  state.bookmarks.splice(index, 1);

  // If the deleted recipe is the currently displayed recipe, mark it as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

/**
 * Upload a new recipe to the server.
 *
 * @param {*} newRecipe - The new recipe data to be uploaded.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // Extract and format ingredients from the newRecipe data
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Create a structured recipe object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Send the recipe data to the server using the sendJSON function
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    // Update the application state with the newly created recipe
    state.recipe = createRecipeObject(data);

    // Add the new recipe to the bookmarks
    addBookmark(state.recipe);
  } catch (err) {
    throw err; // Re-throw any encountered error for handling in the calling code
  }
};
