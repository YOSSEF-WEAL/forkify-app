import View from './view.js';
import icons from 'url:../../img/icons.svg';


class PaginationView extends View
{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler)
    {
        this._parentElement.addEventListener('click', function (e)
        {
            // e.preventDefault();
            const btn = e.target.closest('.btn--inline');
            // console.log(btn);
            if (!btn) return;

            const goToPage = +btn.dataset.goto;
            // console.log(goToPage);

            handler(goToPage);
        })
    }

    _generateMarkup()
    {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages);

        // Page 1, and there are ather pages
        if (curPage === 1 && numPages > 1)
        {
            return `<button data-goTo ="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page  ${curPage + 1}</span>
                      <svg class="search__icon">
                          <use href="${icons}#icon-arrow-right"></use>
                      </svg>
                    </button>`;
        }

        // Last page
        if (curPage === numPages && numPages > 1)
        {
            return `
            <button data-goTo ="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          `;

        }

        // other page
        if (curPage < numPages)
        {
            return `
            <button data-goTo ="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
            </button>

            <button data-goTo ="${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page  ${curPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
            </button>
            `;
        };

        // Page 1, and there are NO ather pages
        return '';
    }
};

export default new PaginationView();