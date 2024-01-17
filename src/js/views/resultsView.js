// This is the View that renders the search results in the DOM

import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

/**
 * Class representing the view for rendering search results in the DOM.
 */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again'; // Default error message
  _Message = ''; // An empty message

  _generateMarkup() {
    // Map over the data and generate markup for each result, then join them together
    return this._data
      .map(results => previewView.render(results, false))
      .join('');
  }
}

// Export an instance of the ResultsView class as a singleton
export default new ResultsView();
