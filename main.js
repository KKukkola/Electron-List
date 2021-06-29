// Project thing under an hour or so
// Introduction to some electron development and what you can do
// Followed this tutorial: https://www.youtube.com/watch?v=kN1Czs0m1SU

// Did a few things,
//  Multiple windows
//  DOM Manupulation
//  Communication between windows

// Used a packager tutorial thing
//  https://www.christianengvall.se/electron-packager-tutorial/

// Used a CSS materialize thing
//  https://materializecss.com/about.html

const electron = require('electron');
const url = require('url');
const path = require('path');
const { cwd } = require('process');

// from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false,
        }
    }); // pass empty object
    // Load html into window
    // Basically just passing in path to loadURL
    // Like so: file://dirname/mainWindow.html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:', 
        slashes: true,
    }))
    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
})

// Handle create add window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
        }
    }); // pass empty object
    // Load html into window
    // Basically just passing in path to loadURL
    // Like so: file://dirname/mainWindow.html
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:', 
        slashes: true,
    }));
    // Garbage collection handle
    addWindow.on('closed', function(){
        addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
    console.log('a');
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// Create menu template
// In Electron, menu is just an array
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
        {
            label: 'Add Item',
            accelerator: "Shift+A",
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear');
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : "Ctrl+Q",
            click(){
                app.quit(); // quits app
            }
        }
        ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({}); // unshift is array method adding to begin of array
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'devtools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload',
            }
        ]
    })
}
