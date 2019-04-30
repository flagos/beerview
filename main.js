// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

var fs = require('fs');
var path = require('path');



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.on('did-finish-load', send_recipes)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function send_recipes () {
    var recipePath = "/home/flagos/project/beer-recipes/recipes";

    var recipesContent = [];
    fs.readdir(recipePath, function (err, files) {
	//handling error
	if (err) {
            return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	files.forEach(function (file) {
            // Do whatever you want to do with the file
	    var recipeContent = {
		file: file,
		dir: recipePath,
		content: fs.readFileSync(path.join(recipePath, file), 'UTF-8')
	    };
            recipesContent.push(recipeContent);

	});
	mainWindow.webContents.send('recipes-list', recipesContent);
    });


}
