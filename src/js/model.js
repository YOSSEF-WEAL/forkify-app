import { API_URl, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookMarks: [],
};
const createRecipeObject = function (data)
{
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        img: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}
export const loadRecipe = async function (id)
{
    try
    {
        const data = await AJAX(`${API_URl}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);

        // console.log(state.recipe);
        if (state.bookMarks.some(bookMark => bookMark.id === id))
            state.recipe.bookMarkd = true;
        else
            state.recipe.bookMarkd = false;
    }
    catch (err)
    {
        console.error(`${err} 💥💥💥`);
        throw err;
    }
};

export const loadSearchResult = async function (query)
{
    try
    {
        state.search.query = query;
        const data = await AJAX(`${API_URl}?search=${query}&key=${KEY}`);
        console.log(data);

        state.search.results = data.data.recipes.map(rec =>
        {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                img: rec.image_url,
                ...(rec.key && { key: rec.key }),
            }
        });
        state.search.page = 1;
    } catch (err)
    {
        console.error(`${err} 💥💥💥`);
        throw err;
    }
};

export const getSeachResultsPage = function (page = state.search.page)
{
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings)
{
    state.recipe.ingredients.forEach(ing =>
    {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        // newQT = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
    });
    state.recipe.servings = newServings;
};

const persisBookMarks = function ()
{
    localStorage.setItem('bookMarks', JSON.stringify(state.bookMarks))
};



export const addBookMark = function (recipe)
{
    // Add bookMark 
    state.bookMarks.push(recipe);
    // Mark current recipe as bookMark
    if (recipe.id === state.recipe.id) state.recipe.bookMarkd = true;
    persisBookMarks();
};


export const deleteBookMark = function (id)
{
    // Delete bookMark 
    const index = state.bookMarks.findIndex(el => el.id === id);
    state.bookMarks.splice(index, 1);

    // Mark current recipe as NOT bookMark
    if (id === state.recipe.id) state.recipe.bookMarkd = false;
    persisBookMarks();
};

const init = function ()
{
    const storage = localStorage.getItem('bookMarks');
    if (storage) state.bookMarks = JSON.parse(storage);
};

init();

const clearBookMarks = function ()
{
    localStorage.clear('bookMarks');
}

// clearBookMarks();
export const uploadRecipe = async function (newRecipe)
{
    try
    {
        // console.log(Object.entries(newRecipe));
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing =>
            {
                const ingArr = ing[1].split(',').map(el => el.trim());
                // const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) throw new Error('Wrong ingredient fromat! Please use the correct fromat :)');

                const [quantity, unit, description] = ingArr;

                return { quantity: quantity ? +quantity : null, unit, description };
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        const data = await AJAX(`${API_URl}?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookMark(state.recipe);
    } catch (err)
    {
        throw err;
    }

};

