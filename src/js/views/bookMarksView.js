import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookMarksView extends View
{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
    _message = '';

    addHendlerRener(handler)
    {
        window.addEventListener('load', handler());
    };

    _generateMarkup()
    {
        return this._data.map(bookMarke => previewView.render(bookMarke, false)).join('');
    };


};
export default new BookMarksView();