$(document).ready(function(){
    $('.sidenav').sidenav();

});

var recipes = [];
var search_txts = [];

var styles = [];
Brauhaus.getStyleCategories().forEach(function(Sc){
    styles[Sc] = Brauhaus.getStyles(Sc);
});

var current_recipe = null;

require('electron').ipcRenderer.on('recipes-list', (event, message) => {

    recipes = [];

    message.forEach(function(item){
	r = Brauhaus.Recipe.fromBeerXml(item["content"]);
	r[0].calculate();
	recipes.push(r);
    });

    // construct list
    var idx = 0;
    recipes.forEach(function(recipe){
	$("#collection-search-results").append(
	    `
<li class="collection-item avatar" onClick='display_recipe_idx(${idx})'>
    <i class="material-icons circle" style="background-color:${Brauhaus.srmToCss(recipe[0].color)}"></i>
    <span class="title">${recipe[0].name}</span>
    <p>${recipe[0].style.category} ${recipe[0].style.category!='' ? '-' : ''}  ${recipe[0].style.name}<br>
     ${recipe[0].abv.toFixed(1)}% - ${recipe[0].ibu.toFixed(0)} IBU
    </p>
</li>
`);
	idx+=1;
    });

    // construct search text
    recipes.forEach(function(recipe){
	var txtValues;
	recipe = recipe[0];
	txtValues = [recipe.name, recipe.style.name];
	recipe.fermentables.forEach(function(f){
	    txtValues.push(f.name);
	});
	recipe.spices.forEach(function(s){ // spices are actually hops
	    txtValues.push(s.name);
	});
	recipe.yeast.forEach(function(y){
	    txtValues.push(y.name + y.type);
	});

	search_txts.push(txtValues.join('/'));
    });


});


function search_recipes() {

    var input, filters, filter, ul, li, a, i, txtValue;

    input = document.getElementById('search');
    filters = input.value.toUpperCase().split(' ');

    ul = document.getElementById("collection-search-results");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < recipes.length; i++) {
	txtValue = search_txts[i];
	var filter_index_min = 0;
	filters.forEach(function(filter){
	    filter_index_min = Math.min(filter_index_min, txtValue.toUpperCase().indexOf(filter));
	});
	if (filter_index_min > -1) {
	    li[i].style.display = "";
	} else {
	    li[i].style.display = "none";
	}
    }
}


function display_recipe_idx(recipe_idx) {
    current_recipe = recipes[recipe_idx][0];
    display_recipe(current_recipe);
}

function display_recipe(recipe) {

    var style = null;
    try {
        style = Brauhaus.getStyle(recipe.style.category, recipe.style.name);
    } catch(e) {

    };


    document.getElementById("recipe_view").innerHTML = compiledTemplateRecipeView({
	    recipe: recipe,
        style: style,
    });

    document.getElementById("nav-wrapper-top").style.backgroundColor = Brauhaus.srmToCss(recipe.color);

    document.getElementById("nav-wrapper-top").innerHTML = `
	    <a href="#" data-target="slide-out" class="sidenav-trigger show-on-large"><i class="material-icons">menu</i></a>
	    <a class="breadcrumb">Recipes</a>
	    <a class="breadcrumb">${recipe.name}</a>
`;
    $('.collapsible').collapsible();


    var contenteditable_objects = document.querySelectorAll('[contenteditable=true]');

    $('.fixed-action-btn').floatingActionButton();

    init_autocompletion();
}

function init_autocompletion() {


    var styles_completion = [];

    for (var Sc in styles) {
        for (let style of styles[Sc]) {
            styles_completion.push(Sc + " - " + style);
        }
    }

    $('#style_name').autocomplete({
        source : styles_completion,
        change: recipe_completion_onchange,
    });


}

function recipe_completion_onchange(event, ui) {
    var style_input = $('#style_name').text();

    var segments = style_input.split(' - ');

    var style_category = segments.shift();
    var style_name = segments.join(' - ');

    current_recipe.style.category = style_category;
    current_recipe.style.name = style_name;

    display_recipe(current_recipe);
}
