

$(document).ready(function(){
    $('.sidenav').sidenav();
});

var recipes = [];
var search_txts = [];

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
    recipes.forEach(function(recipe){
	$("#collection-search-results").append(
	    `
<li class="collection-item avatar">
    <i class="material-icons circle" style="background-color:${Brauhaus.srmToCss(recipe[0].color)}"></i>
    <span class="title">${recipe[0].name}</span>
    <p>${recipe[0].style.name}<br>
     ${recipe[0].abv.toFixed(1)}% - ${recipe[0].ibu.toFixed(0)} IBU
    </p>
</li>
`);
    });

    recipes.forEach(function(recipe){
	// construct search text
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

    var input, filter, ul, li, a, i, txtValue;

    input = document.getElementById('search');
    filter = input.value.toUpperCase();

    ul = document.getElementById("collection-search-results");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < recipes.length; i++) {
	txtValue = search_txts[i];
	if (txtValue.toUpperCase().indexOf(filter) > -1) {
	    li[i].style.display = "";
	} else {
	    li[i].style.display = "none";
	}
    }
}
