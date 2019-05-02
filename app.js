

$(document).ready(function(){
    $('.sidenav').sidenav();
});


require('electron').ipcRenderer.on('recipes-list', (event, message) => {
    console.log(message);
    var recipes = [];

    message.forEach(function(item){
	r = Brauhaus.Recipe.fromBeerXml(item["content"]);
	r[0].calculate();
	recipes.push(r);
    });

    console.log(recipes);

    recipes.forEach(function(recipe){
	$("#collection-search-results").append(
	    `
<li class="collection-item avatar">
    <i class="material-icons circle red">play_arrow</i>
    <span class="title">${recipe[0].name}</span>
    <p>${recipe[0].style.name}<br>
     ${recipe[0].abv.toFixed(1)}° - ${recipe[0].ibu.toFixed(0)} IBU
    </p>
    <a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>
</li>
`);
    });
});
