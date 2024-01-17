// This is the View for the next and back buttons at the bottom of the searchView sidebar

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  /**
   * Generate HTML markup for pagination buttons based on the current page and total number of pages.
   * @returns {string} - The generated HTML markup for pagination buttons.
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // console.log(numPages);

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      //   return `
      //           <button class="btn--inline pagination__btn--next">
      //               <span>Page ${curPage + 1}</span>
      //               <svg class="search__icon">
      //                 <use href="${icons}#icon-arrow-right"></use>
      //               </svg>
      //           </button>
      //           `;
      return this._generateMarkupButton(curPage, 'right');
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage, 'left');
    }

    // Other page
    if (curPage < numPages) {
      return this._generateMarkupButton(curPage, 'both');
    }

    // Page 1, and there are NO other pages
    return '';
  }

  /**
   * Generate HTML markup for a pagination button based on the current page and direction.
   * @param {number} curPage - The current page.
   * @param {string} direction - The direction of the pagination button ('both', 'left', or 'right').
   * @returns {string} - The generated HTML markup for the pagination button.
   */
  _generateMarkupButton(curPage, direction) {
    if (direction === 'both') {
      // If pagination is between pages e.g. curPage === pg2 <-- curPage(pg3) --> pg4
      return `
        <button data-goto=${
          curPage - 1
        } class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
  
        <button data-goto=${
          curPage + 1
        } class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // If pagination in one direction (either left(lastPage) or right(firstPage))
    return `
      <button data-goto=${
        direction === 'left' ? curPage - 1 : curPage + 1
      } class="btn--inline pagination__btn--${
      direction === 'left' ? 'prev' : 'next'
    }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${
      direction === 'left' ? 'left' : 'right'
    }"></use>
        </svg>
        <span>Page ${direction === 'left' ? curPage - 1 : curPage + 1}</span>
      </button>
    `;
  }
}

export default new PaginationView();
