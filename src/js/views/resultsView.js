import View from './view.js';
import previewView from './previewView.js';

class ResultView extends View
{
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe find for your query! . Please try again ;)!';
  _message = '';
  _generateMarkup()
  {
    return this._data
      .map(result => previewView.render(result, false)).join('');

  }

};
export default new ResultView();