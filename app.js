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

const ingredients_malt = [];
const ingredients_malt_per_name = {};
const fermentable_completion = [];
const ingredients_hop = [];
const ingredients_hop_per_name = {};
const hop_completion = [];


fs.createReadStream('ingredients/malt.csv')
  .pipe(csv())
  .on('data', (data) => ingredients_malt.push(data))
  .on('end', () => {
	ingredients_malt.forEach(function(item){
	    fermentable_completion.push({label: item.Name, category: item.Type});
	    ingredients_malt_per_name[item.Name] = item;
	});

      fermentable_completion.sort((a, b) => (a.category > b.category) ? 1 : -1);
      // console.log(ingredients_malt);
  });

fs.createReadStream('ingredients/hop.csv')
  .pipe(csv())
  .on('data', (data) => ingredients_hop.push(data))
  .on('end', () => {
	ingredients_hop.forEach(function(item){
	    hop_completion.push({label: item.Name, category: item.Type});
	    ingredients_hop_per_name[item.Name] = item;
	});

      hop_completion.sort((a, b) => (a.category > b.category) ? 1 : -1);


      // console.log(ingredients_hop);
  });

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

    $('span.fermentable-quantity-value').focusout((event) => {
	var index =  $( "#fermentable-table li" ).index(event.target.parentElement.parentElement.parentElement);
	var qty = parseFloat(event.target.parentElement.parentElement.children[2].children[0].textContent);

	current_recipe.fermentables[index].weight = qty;

	current_recipe.calculate();
	display_recipe(current_recipe);
    });

    $('span.hop-quantity-value').focusout((event) => {
	var index =  $( "#hop-table li" ).index(event.target.parentElement.parentElement.parentElement);
	var qty = parseFloat(event.target.parentElement.parentElement.children[2].children[0].textContent);

	current_recipe.spices[index].weight = qty/1000;

	current_recipe.calculate();
	display_recipe(current_recipe);
    });

}

function init_autocompletion() {


    var styles_completion = [];

    for (var Sc in styles) {
        for (let style of styles[Sc]) {
            styles_completion.push({label: style, category: Sc});
        }
    }
    $( function() {
        $.widget( "custom.catcomplete", $.ui.autocomplete, {
            _create: function() {
                this._super();
                this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
            },
            _renderMenu: function( ul, items ) {
                var that = this,
                    currentCategory = "";
                $.each( items, function( index, item ) {
                    var li;
                    if ( item.category != currentCategory ) {
                        ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
                        currentCategory = item.category;
                    }
                    li = that._renderItemData( ul, item );
                    if ( item.category ) {
                        li.attr( "aria-label", item.category + " : " + item.label );
                    }
                });
            }
        });

	$('#style_name').catcomplete({
            source : styles_completion,
            change: style_completion_onchange,
            display: 0
	});

	$('span.fermentable-name').catcomplete({
            source : fermentable_completion,
            change: fermentable_completion_onchange,
            display: 0
        });

	$('span.hop-name').catcomplete({
            source : hop_completion,
            change: hop_completion_onchange,
            display: 0
        });

    } );
}

function style_completion_onchange(event, ui) {
    current_recipe.style.category = ui.item.category;
    current_recipe.style.name = ui.item.label;

    display_recipe(current_recipe);
}

function fermentable_completion_onchange(event, ui) {

    var index =  $( "#fermentable-table li" ).index(event.target.parentElement.parentElement);
    var qty = parseFloat(event.target.parentElement.children[2].children[0].textContent);

    current_recipe.fermentables[index].name = event.target.textContent;
    current_recipe.fermentables[index].weight = qty;

    current_recipe.fermentables[index].color = parseFloat(ingredients_malt_per_name[current_recipe.fermentables[index].name]["Color SRM"]);
    current_recipe.fermentables[index].yield = parseFloat(ingredients_malt_per_name[current_recipe.fermentables[index].name]["Dry Yield"]);


    current_recipe.calculate();
    display_recipe(current_recipe);
}

function hop_completion_onchange(event, ui) {

    var index =  $( "#hop-table li" ).index(event.target.parentElement.parentElement);
    var qty = parseFloat(event.target.parentElement.children[2].children[0].textContent);

    current_recipe.spices[index].name = event.target.textContent;
    current_recipe.spices[index].weight = qty/1000;

    current_recipe.spices[index].aa = parseFloat(ingredients_hop_per_name[current_recipe.spices[index].name]["Alpha (%)"]);

    current_recipe.calculate();
    display_recipe(current_recipe);
}
