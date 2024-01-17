// This is the View that renders the search results in the DOM

import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

/**
 * Class representing the view for rendering search results in the DOM.
 */
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)'; // Default error message
  _Message = ''; // An empty message

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    // Map over the data and generate markup for each result, then join them together
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

// Export an instance of the ResultsView class as a singleton
export default new bookmarksView();
