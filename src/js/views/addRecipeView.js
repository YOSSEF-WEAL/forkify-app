import View from './view.js';
import icons from 'url:../../img/icons.svg';


class AddRecipeView extends View
{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe Was successfully uploaded :)';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor()
    {
        super();
        this._addHendlerShowWindow();
        this._addHendlerHideWindow();
        this.addHendlerUpload();

    };

    toggelWindow()
    {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    };

    _addHendlerShowWindow()
    {
        this._btnOpen.addEventListener('click', this.toggelWindow.bind(this))
    };
    _addHendlerHideWindow()
    {
        this._btnClose.addEventListener('click', this.toggelWindow.bind(this))
        this._overlay.addEventListener('click', this.toggelWindow.bind(this))
    };

    addHendlerUpload(handler)
    {
        this._parentElement.addEventListener('submit', function (e)
        {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            // handler(data);
            handler;
        });
    };

    _generateMarkup()
    {

    };
};

export default new AddRecipeView();