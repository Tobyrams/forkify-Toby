/**
 * Class representing the view for handling search-related functionality in the DOM.
 */
class SearchView {
  _parentEl = document.querySelector('.search'); // The parent element where search-related content will be handled

  /**
   * Gets the search query from the input field.
   *
   * @returns {string} - The search query entered by the user.
   */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  /**
   * Adds a search event handler.
   *
   * @param {*} handler - The function to be executed when the search form is submitted.
   */
  addHandlerSearch(handler) {
    // Attach an event listener to the search form to handle form submission
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // Call the provided handler function when the form is submitted
    });
  }
}

// Export an instance of the SearchView class as a singleton
export default new SearchView();
