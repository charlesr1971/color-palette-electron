import {IpcService} from "./IpcService";
import AppPaths from './AppPaths';

import * as path from 'path';
import * as imagemagick from 'imagemagick-darwin-static';
import * as graphicsmagick from 'graphicsmagick-static';
import * as os from 'os';
import * as gm from 'gm';

var imageHandler = null;

const ipc = new IpcService();

const requestOsInfo = document.getElementById('request-os-info');
const requestOsInfoContainer = document.getElementById('request-os-info-container');

if(requestOsInfo && requestOsInfoContainer){

  requestOsInfo.addEventListener('click', async () => {

    const t1 = await ipc.send<{ kernel: string }>('system-info');
    requestOsInfoContainer.innerHTML = t1.kernel;

  });

}

const image1Info = document.getElementById('image-1-info');
const image1InfoContainer = document.getElementById('image-1-info-container');

if(image1Info && image1InfoContainer){

  image1Info.addEventListener('click', async () => {

    const t2 = await ipc.send<{ size: string }>('image-info');
    image1InfoContainer.innerHTML = t2.size;

  });

}

const imagemagickPath = imagemagick.path;
let imagemagickFixedPath = AppPaths.replaceAsar(imagemagickPath);

console.log('app.ts: imagemagickFixedPath',imagemagickFixedPath);
console.log('app.ts: AppPaths.replaceAsar(path.join(imagemagick.path, "/"))',AppPaths.replaceAsar(path.join(imagemagick.path, "/")));

const graphicsmagickPath = graphicsmagick.path;
let graphicsmagickFixedPath = AppPaths.replaceAsar(graphicsmagickPath);

console.log('app.ts: graphicsmagickFixedPath',graphicsmagickFixedPath);
console.log('app.ts: AppPaths.replaceAsar(path.join(graphicsmagick.path, "/"))',AppPaths.replaceAsar(path.join(graphicsmagick.path, "/")));

console.log("app.ts: os.platform(): ",os.platform());

if (os.platform() == "win32") {
  gm.subClass({
    appPath: AppPaths.replaceAsar(path.join(graphicsmagick.path, "/"))
  })
} else {
  gm.subClass({
    imageMagick: true,
    appPath: AppPaths.replaceAsar(path.join(imagemagick.path, "/"))
  })
}

gm("src/app/assets/images/for-palette/1.jpg").size(function(err, value){
  // note : value may be undefined
  console.log("app.ts: value: ",value);
})


