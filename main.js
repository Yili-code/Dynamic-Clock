const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 250,
    minWidth: 600,
    minHeight: 250,
    show: false,
    transparent: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
