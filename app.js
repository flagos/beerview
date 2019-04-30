

$(document).ready(function(){
    $('.sidenav').sidenav();
});


require('electron').ipcRenderer.on('recipes-list', (event, message) => {
    console.log(message);
});
