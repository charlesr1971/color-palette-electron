import { app, BrowserWindow, ipcMain } from 'electron';
import { IpcChannelInterface } from "./IPC/IpcChannelInterface";
import { SystemInfoChannel } from "./IPC/SystemInfoChannel";
import { ImageInfoChannel } from "./IPC/ImageInfoChannel";
import { rootPath } from 'electron-root-path';
//import * as rootPath from 'electron-root-path';
import * as path from 'path';


class Main {

  private mainWindow: BrowserWindow | undefined;

  public debug: boolean = false;

  public init(ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      title: `Yet another Electron Application`,
      webPreferences: {
        nodeIntegration: true
      }
    });
    this.mainWindow.webContents.openDevTools();
    let isPackaged: boolean = false;
    if(process.mainModule){
      isPackaged = process.mainModule.filename.indexOf('app.asar') !== -1;
    }
    const location = path.join(rootPath, 'resources/app.asar/index.html');
    if(this.debug){
      console.log("main.ts: createWindow: process.env: ",process.env);
      console.log("main.ts: createWindow: process.mainModule: ",process.mainModule);
      console.log("main.ts: createWindow: isPackaged: ",isPackaged);
      console.log("main.ts: createWindow: location: ",location);
    }
    if(isPackaged){
      this.mainWindow.loadFile(location);
    }
    else{
      this.mainWindow.loadFile('../../index.html');
    }
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }

}

(new Main()).init([
  new SystemInfoChannel(),
  new ImageInfoChannel()
]);
