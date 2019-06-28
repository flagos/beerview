$(document).ready(function(){
    $('.sidenav').sidenav();

});

var recipes = [];
var search_txts = [];

var styles = [];
Brauhaus.getStyleCategories().forEach(function(Sc){
    styles[Sc] = Brauhaus.getStyles(Sc);
});

var current_recipe_modif = false;

require('electron').ipcRenderer.on('recipes-list', (event, message) => {
    console.log(message);

    recipes = [];

    message.forEach(function(item){
	r = Brauhaus.Recipe.fromBeerXml(item["content"]);
	r[0].calculate();
	recipes.push(r);
    });

    console.log(recipes);

    // construct list
    var idx = 0;
    recipes.forEach(function(recipe){
	$("#collection-search-results").append(
	    `
<li class="collection-item avatar" onClick='display_recipe(${idx})'>
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


function display_recipe(recipe_idx) {

    var recipe = recipes[recipe_idx][0];
    var style = null;
    try {
        style = Brauhaus.getStyle(recipe.style.category, recipe.style.name);
        console.log(style);
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

    // var myFunction = function() {
    //     current_recipe_modif = true;
    //     console.log("input event fired");
    // };

    // for (var i = 0; i < contenteditable_objects.length; i++) {
    //     contenteditable_objects[i].addEventListener('input', myFunction, false);
    // }

    $('.fixed-action-btn').floatingActionButton();

    init_autocompletion();
}

function init_autocompletion() {


    var liste = [
        "Draggable",
        "Droppable",
        "Resizable",
        "Selectable",
        "Sortable"
    ];

    $('#style_name').autocomplete({
        source : liste
    });




    console.log("init done");

}
