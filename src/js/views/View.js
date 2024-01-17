import icons from 'url:../../img/icons.svg';
export default class View {
  _data; // Holds the recipe data

  /**
   * Render content based on the provided data.
   * @param {*} data - The data to be rendered.
   * @returns {undefined} - The function does not return a value explicitly.
   */
  render(data, render = true) {
    // Check if data is falsy or an empty array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // Call renderError method if no data is provided or data is an empty array

    this._data = data; // Store the data
    const markup = this._generateMarkup(); // Generate markup based on the provided data

    if (!render) return markup;

    this._clear(); // Clear existing content in the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the generated markup in the DOM
  }

  /**
   * Clears the HTML content of the DOM.
   * Private method accessible only within the class.
   */
  _clear() {
    this._parentElement.innerHTML = ''; // Clear the parent element's content
  }

  /**
   * Updates the view with new data.
   *
   * @param {*} data - The new data to update the view.
   * @returns {void}
   */
  update(data) {
    this._data = data; // Store the new data

    // Generate new markup based on the provided data
    const newMarkup = this._generateMarkup();

    // Create a new DOM fragment from the new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Convert the DOM fragment into an array of new elements
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    // Convert the current parent element's children into an array of current elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Loop through each new element and compare/update with the corresponding current element
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  /**
   * Renders the loading spinner while the data is being fetched.
   */
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear(); // Clear existing content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the spinner markup
  }

  /**
   * Renders an error message in the DOM.
   *
   * @param {*} message - The error message to be displayed. Defaults to a predefined error message.
   */
  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear(); // Clear existing content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the error message markup
  }

  renderMessage(message = this._Message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    // Clear any existing content in the parent element
    this._clear();
    // Insert the error message markup at the beginning of the parent element
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
