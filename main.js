const electron = require('electron')
const url = require('url')
const path = require('path')

const { app, BrowserWindow, Menu } = electron

let mainWindow
let addWindow

// Listen for app to be ready
app.on('ready', function() {
    
    // Create new window
    mainWindow = new BrowserWindow({})

    //Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Quit app when close
    mainWindow.on('closed', function() {
        app.quit()
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    
    //Insert menu
    Menu.setApplicationMenu(mainMenu)

})

// Handle create add window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    })

    // Garbage collection
    addWindow.on('close', function() {
        addWindow = null
    })

    //Load html file into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
}

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow()
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit()
                }
            }
        ]
    }
]

// If mac, add empty object to beginning of menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({})
}

// Add developer tools if not in prod
if(process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}