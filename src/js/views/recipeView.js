import View from './View.js';

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

/**
 * Class representing the view for rendering recipe-related content in the DOM.
 */
class RecipeView extends View {
  // Private properties
  _parentElement = document.querySelector('.recipe'); // The parent element where the recipe content will be rendered
  _errorMessage = 'We could not find that recipe. Please try another one!'; // Default error message
  _Message = ''; // An empty message

  /**
   * Adds a given handler function to the 'hashchange' and 'load' events of the window.
   * These events are commonly used in web applications to trigger actions when the URL hash changes or when the page is fully loaded.
   *
   * @param {*} handler - The function to be executed when the 'hashchange' or 'load' event occurs.
   */
  addHandlerRender(handler) {
    // Iterate over each event type ('hashchange' and 'load')
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler)); // Add the provided handler function to the corresponding window event
  }

  /**
   *
   * @param {*} handler
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      //Update only if the number is greater than zero
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnBookmark = e.target.closest('.btn--bookmark');

      if (!btnBookmark) return;

      handler();
    });
  }

  /**
   * Private method that generates the HTML markup for rendering the recipe on the DOM.
   *
   * @returns {string} - HTML markup for the recipe.
   */
  _generateMarkup() {
    // Template literal containing the HTML structure with placeholders for dynamic content
    return `
    <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">

          ${this._data.ingredients
            .map(ing => {
              return `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ing.quantity ? new Fraction(ing.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
            </li>
            `;
            })
            .join('')}
            

            
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
  }
}

// Export an instance of the RecipeView class as a singleton
export default new RecipeView();
