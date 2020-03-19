import {IpcService} from "./IpcService";
import AppPaths from './AppPaths';

import * as path from 'path';
import * as imagemagick from 'imagemagick-darwin-static';
import * as graphicsmagick from 'graphicsmagick-static';
import * as os from 'os';
import * as gm from 'gm';
import * as fs from "fs";

// GLOBALS

var debug = true;

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

// METHODS

function find(outers: any, selector: string, first: boolean) {

  var outers = (arguments[0] != null) ? arguments[0] : null;
  var selector: string = (arguments[1] != null) ? arguments[1] : "";
  var first: boolean = (arguments[2] != null) ? arguments[2] : true;


  var found_elements: any = [];

  // Find all the outer matched elements
  //var outers = document.querySelectorAll(selector);

  for(var i=0; i<outers.length; i++) {

    var elements_in_outer = outers[i].querySelectorAll(selector);

    // document.querySelectorAll() returns an "array-like" collection of elements
    // convert this "array-like" collection to an array
    elements_in_outer = Array.prototype.slice.call(elements_in_outer);
    
    found_elements = found_elements.concat(elements_in_outer);
  }

  if(first && found_elements.length > 0){
    found_elements = found_elements[0];
  }

  return found_elements;
}

gm("src/app/assets/images/for-palette/1.jpg").size(function(err, value){
  // note : value may be undefined
  console.log("app.ts: value: ",value);
})

/* gm("src/app/assets/images/for-palette/1.jpg").identify(function(err, value){
  // note : value may be undefined
  console.log("app.ts: value: ",value);
}) */

// SELECTORS

const imageContainer = Array.prototype.slice.call(document.querySelectorAll(".image-container"));

imageContainer.map( (element: any, idx: number) => {

  var id = element.getAttribute("id");
  var namespaceArr = id.split("-");
  var namespace = 0;
  if(namespaceArr.length > 0){
    namespace = namespaceArr[2];
    if(isNaN(namespace)){
      namespace = 0;
    }
  }
  if(debug){
    console.log("app.ts: namespace: ",namespace);
  }

  var img = document.createElement("img");
  img.setAttribute("id","image-" + namespace);
  img.setAttribute("src","src/app/assets/images/output/" + outputimageFilename);
  imageContainer.appendChild(img);

});

const fileContainerInner = Array.prototype.slice.call(document.querySelectorAll(".add-image-file-container-inner"));

fileContainerInner.map( (element: any, idx: number) => {

  var id = element.getAttribute("id");
  var namespaceArr = id.split("-");
  var namespace = 0;
  if(namespaceArr.length > 0){
    namespace = namespaceArr[5];
    if(isNaN(namespace)){
      namespace = 0;
    }
  }
  if(debug){
    console.log("app.ts: namespace: ",namespace);
  }
	var currentObj = document.querySelectorAll("#" + id);
	
	var inputfile = find(currentObj,"input[type='file']",true);
	var inputfilelabel = find(currentObj,"#add-image-inputfile-label",true);
	var inputfiletextcontainer = find(currentObj,"#add-image-inputfile-text-container",true);
	var inputfiletext = find(currentObj,"#add-image-inputfile-text",true);
  var inputfilereset = find(currentObj,"#add-image-inputfile-reset",true);
  var imageContainer = document.getElementById("image-container-" + namespace);
  
	if(inputfile > 0 && inputfilelabel > 0 && inputfiletextcontainer > 0 && inputfiletext > 0 && inputfilereset > 0){

	  
    
  }

  inputfile.addEventListener("change",function(event: any){

    var filepath = event.target.value;
    if(filepath.indexOf("fakepath") != -1){
      var id = event.target.getAttribute("id");
      var currentObj: any = document.getElementById(id); 
      if(currentObj){
        var _filename: any = currentObj.files[0].name;
        var _filepath: any = currentObj.files[0].path;
        var _fileextArr: any = _filename.split(".");
        var _fileext: string = "";
        if(_fileextArr.length > 0){
          _fileext = _fileextArr[_fileextArr.length - 1];
        }
        filepath = _filepath;
        if(debug){
          console.log("app.ts: _filename: ",_filename);
          console.log("app.ts: _filepath: ",_filepath);
          console.log("app.ts: filepath: ",filepath);
          console.log("app.ts: _fileextArr: ",_fileextArr);
          console.log("app.ts: _fileext: ",_fileext);
        }
        var readStream = fs.createReadStream(filepath);
        gm(readStream)
        .size({bufferStream: true}, function(err,size) {
          /* this.extent(0,0);
          this.matte();
          this.colorspace("rgb");
          this.bitdepth(8);
          this.dither(true);
          this.colors(50); */
          this.resize(160,160,"!");
          var outputimageFilename: string = namespace + "_out_image." + _fileext;
          var histogramFilename: string = namespace + "_histogram.miff";
          this.write("src/app/assets/images/output/" + outputimageFilename, function (err: any) {

            gm("src/app/assets/images/output/" + outputimageFilename).in("src/app/assets/images/output/" + outputimageFilename).command("convert").out("src/app/assets/histograms/" + histogramFilename).stream();

            //gm("src/app/assets/images/output/" + outputimageFilename).identify(function (err: any, data: any) {

              if(!err){
                if(debug){
                  console.log("app.ts: output file created");
                }
                if(imageContainer){
                  var img = document.createElement("img");
                  img.setAttribute("id","image-" + namespace);
                  img.setAttribute("src","src/app/assets/images/output/" + outputimageFilename);
                  imageContainer.appendChild(img);
                }
              };

            //});

          });
        });
      }
    }
    if(debug){
      console.log("app.ts: filepath: ",filepath);
    }

  });

});


