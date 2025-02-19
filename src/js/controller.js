import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipView.js';
import seachView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
console.log('test top 20');


const controlRecipes = async function ()                                
{
  try
  {
    const id = window.location.hash.slice(1);
    if (!id) return;
    await recipeView.renderSpinner();

    // 0) Update result view to mark selected search result
    resultView.update(model.getSeachResultsPage());

    // 1) Update bookMarks View
    bookMarksView.update(model.state.bookMarks);

    // 2) loding recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    await recipeView.render(model.state.recipe);


  }

  catch (err)
  {
    recipeView.renderError();
    console.error(err);
  }

}
controlRecipes();

const controlSearchResults = async function ()
{
  try
  {
    resultView.renderSpinner();

    // 1) Get search query
    const query = seachView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResult(query);

    // 3) Render results
    resultView.render(model.getSeachResultsPage());

    // 4) Render initial pagination buttons 
    paginationView.render(model.state.search);

  } catch (err)
  {
    console.error(err);
  }
};

const controlPagination = function (goToPage)
{
  // 1) Render New results
  resultView.render(model.getSeachResultsPage(goToPage));

  // 4) Render New pagination buttons 
  paginationView.render(model.state.search);
};

const controlServings = function (newServings)
{
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view 
  recipeView.update(model.state.recipe);
};



const controlAddBookMark = function ()
{
  //1) Add/Remove bookMark
  if (!model.state.recipe.bookMarkd)
    model.addBookMark(model.state.recipe);
  else
    model.deleteBookMark(model.state.recipe.id);
  //2) Update recipeView
  recipeView.update(model.state.recipe);
  //3) Render bookmarks
  bookMarksView.render(model.state.bookMarks);
};

const controlBookMarks = function ()
{
  bookMarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe)
{
  try
  {

    // Show loading spinner 
    addRecipeView.renderSpinner();

    // upload the new recipe data 
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render bookMarksView
    bookMarksView.render(model.state.bookMarks);


    // Change ID in url 
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();
    // close form window
    setTimeout(function ()
    {
      // addRecipeView.toggelWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err)
  {
    console.log('💥', err);
    addRecipeView.renderError(err.message);
  }
};


const wel = function ()
{
  console.log('Welcome to my app for searching for recipes.');
};

const init = function ()
{
  bookMarksView.addHendlerRener(controlBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServigs(controlServings);
  recipeView.addHandlerBookMark(controlAddBookMark);
  seachView.addHadlerSeach(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHendlerUpload(controlAddRecipe);
  wel();
};
init();




