import { IpcService } from "./IpcService";
import AppPaths from './AppPaths';

import * as path from 'path';
import * as imagemagick from 'imagemagick-darwin-static';
import * as graphicsmagick from 'graphicsmagick-static';
import * as os from 'os';
import * as gm from 'gm';
import * as fs from "fs";

import * as Store from "electron-store";


// GLOBALS

var debug = false;

var imageHandler = null;

var swatchQtyAscArr = [5,10,25,50];
var swatchQtyDescArr = swatchQtyAscArr.reverse();

const store = new Store();

if(!store.has('swatches')){

  store.set('swatches',50);

  if(debug){
    console.log("app.ts: store: store.get('swatches') 1: ",store.get('swatches'));
  }

}
else{

  if(debug){
    console.log("app.ts: store: store.get('swatches') 2: ",store.get('swatches'));
  }

}

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

if(debug){
  console.log('app.ts: imagemagickFixedPath',imagemagickFixedPath);
  console.log('app.ts: AppPaths.replaceAsar(path.join(imagemagick.path, "/"))',AppPaths.replaceAsar(path.join(imagemagick.path, "/")));
}

const graphicsmagickPath = graphicsmagick.path;
let graphicsmagickFixedPath = AppPaths.replaceAsar(graphicsmagickPath);

if(debug){
  console.log('app.ts: graphicsmagickFixedPath',graphicsmagickFixedPath);
  console.log('app.ts: AppPaths.replaceAsar(path.join(graphicsmagick.path, "/"))',AppPaths.replaceAsar(path.join(graphicsmagick.path, "/")));
  console.log("app.ts: os.platform(): ",os.platform());
}

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

console.log(process.env);

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


function rgbToHex(red: any, green: any, blue: any){

  var _red = "0" + parseInt(red,16);
  _red = _red.substring(_red.length - 2);
  var _green = "0" + parseInt(green,16);
  _green = _green.substring(_green.length - 2);
  var _blue = "0" + parseInt(blue,16);
  _blue = _blue.substring(_blue.length - 2);
  return _red + _green + _blue;

}

function strToObj(str: string){

  var obj = {};
  if(str&&typeof str ==='string'){
    var objStr = str.match(/\{(.)+\}/g);
    eval("obj ="+objStr);
  }
  return obj

}

function fileExists(filePath: string){

  try {
    if (fs.existsSync(filePath)) {
      return true;
    }
  } catch(err) {
    return false;
  }

}

function writeFiles(filepath: any, imageContainer: any, imageInfoContainer: any, namespace: number, fileInputObj: any){

  var filepath = (arguments[0] != null) ? arguments[0] : "";
  var imageContainer = (arguments[1] != null) ? arguments[1] : null;
  var imageInfoContainer = (arguments[2] != null) ? arguments[2] : null;
  var namespace: number = (arguments[3] != null) ? arguments[3] : 0;
  var fileInputObj = (arguments[4] != null) ? arguments[4] : null;

  if(filepath != "" && imageContainer && imageInfoContainer && !isNaN(namespace) && namespace > 0){

    var _filename: any = "";
    var _filepath: any = "";
    var _filenameArr: any = [];

    if(fileInputObj && filepath.indexOf("fakepath") != -1){
      _filename = fileInputObj.files[0].name;
      _filepath = fileInputObj.files[0].path;
    }
    else{
      _filenameArr = filepath.split("/");
      if(_filenameArr.length > 0){
        _filename = _filenameArr[_filenameArr.length - 1];
      }
      else{
        _filenameArr = filepath.split("\\");
        if(_filenameArr.length > 0){
          _filename = _filenameArr[_filenameArr.length - 1];
        }
      }
      _filepath = filepath;
    }

    var _fileextArr: any = _filename.split(".");
    var _fileext: string = "";
    if(_fileextArr.length > 0){
      _fileext = _fileextArr[_fileextArr.length - 1];
    }

    var regex = /(jpg|jpeg|JPG|JPEG)/igm;
    if(_fileext.match(regex)){
      _fileext = "jpg";
      if(debug){
        console.log("app.ts: writeFiles: _fileext jpg match...");
      }
    }

    filepath = _filepath;

    if(debug){
      console.log("app.ts: writeFiles: imageContainer: ",imageContainer);
      console.log("app.ts: writeFiles: imageInfoContainer: ",imageInfoContainer);
      console.log("app.ts: writeFiles: namespace: ",namespace);
      console.log("app.ts: writeFiles: filepath: ",filepath);
      console.log("app.ts: _filepath: ",_filepath);
      console.log("app.ts: writeFiles: _filenameArr: ",_filenameArr);
      console.log("app.ts: writeFiles: _filename: ",_filename);
      console.log("app.ts: writeFiles: _fileextArr: ",_fileextArr);
      console.log("app.ts: writeFiles: _fileext: ",_fileext);
    }

    var outputimageFilename: string = namespace + "_out_image." + _fileext;
    var histogramFilename: string = namespace + "_histogram.miff";

    var img = gm(filepath);

    var swatches = 0;

    if(store.has('swatches') && !isNaN(store.get('swatches')) && store.get('swatches') > 0){
      swatches = parseInt(store.get('swatches'));
    }

    if(debug){
      console.log("app.ts: writeFiles: swatches: ",swatches);
    }

    /* if(fileExists("src/app/assets/histograms/" + histogramFilename)){
      fs.unlinkSync("src/app/assets/histograms/" + histogramFilename);
    } */

    return img.noProfile().bitdepth(8).colors(swatches).write("histogram:src/app/assets/histograms/" + histogramFilename, function (err) {

      addColorSwatchesToPalette(imageInfoContainer, "src/app/assets/histograms/" + histogramFilename,namespace);

      /* if(fileExists("src/app/assets/images/output/" + outputimageFilename)){
        fs.unlinkSync("src/app/assets/images/output/" + outputimageFilename);
      } */

      this.write("src/app/assets/images/output/" + outputimageFilename, function (err: any) {

        if(!err){
          if(debug){
            console.log("app.ts: output file created");
          }
          addImageToImageConatiner(imageContainer, "src/app/assets/images/output/" + outputimageFilename, namespace);
        }

      });

    });
    
  }

}

/* function getNamespace(file: any){

  var file = (arguments[0] != null) ? arguments[0] : null;

  if (file.isFile()){
    if(debug){
      console.log("'%s' is a file.", outputDirPath);
    }
    var _fileArr: any = file.split("_");
    if(_fileArr.length > 0){
      namespace = _fileArr[0];
    }
  }
  else if (stat.isDirectory()){
    if(debug){
      console.log("'%s' is a directory.", outputDirPath);
    }
  }

} */

function displayImagesAndHistograms(){

  var outputDir = "src/app/assets/images/output/";

  // Loop through all the files in the temp directory
  fs.readdir(outputDir, function (err, files) {

    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    files.forEach(function (file, index) {
      // Make one pass and make the file complete
      var outputDirPath = path.join(outputDir, file);

      fs.stat(outputDirPath, function (error, stat) {

        if (error) {
          console.error("Error stating file.", error);
          return;
        }

        var namespace = 0;

        if (stat.isFile()){
          if(debug){
            console.log("'%s' is a file.", outputDirPath);
          }
          var _fileArr: any = file.split("_");
          if(_fileArr.length > 0){
            namespace = _fileArr[0];
          }
        }
        else if (stat.isDirectory()){
          if(debug){
            console.log("'%s' is a directory.", outputDirPath);
          }
        }

        var outputimageFilename: string = file;

        var imageContainer = document.getElementById("image-container-" + namespace);

        addImageToImageConatiner(imageContainer, outputDir + outputimageFilename, namespace);

        var histogramFilename: string = namespace + "_histogram.miff";

        if(fileExists("src/app/assets/histograms/" + histogramFilename)){

          if(debug){
            console.log("app.ts: files.forEach: namespace: ",namespace);
          }

          var imageInfoContainer = document.getElementById("image-info-container-" + namespace);

          addColorSwatchesToPalette(imageInfoContainer, "src/app/assets/histograms/" + histogramFilename,namespace);

        }

      });

    });

  });

}

function addImageToImageConatiner(imageContainer: any, src: string, namespace: number){

  var imageContainer = (arguments[0] != null) ? arguments[0] : null;
  var src: string = (arguments[1] != null) ? arguments[1] : "";
  var namespace: number = (arguments[2] != null) ? arguments[2] : 0;

  if(imageContainer && src != "" && !isNaN(namespace) && namespace > 0){
    imageContainer.innerHTML = "";
    var img = document.createElement("img");
    img.setAttribute("id","image-" + namespace);
    img.setAttribute("src",src + "?" + new Date().getTime());
    imageContainer.appendChild(img);
  }

}

function addColorSwatchesToPalette(imageInfoContainer: any, histogramFilePath: string, namespace: number){

  var imageInfoContainer = (arguments[0] != null) ? arguments[0] : null;
  var histogramFilePath: string = (arguments[1] != null) ? arguments[1] : "";
  var namespace: number = (arguments[2] != null) ? arguments[2] : 0;

  if(histogramFilePath != ""){

    var rs = fs.createReadStream(histogramFilePath, {encoding: 'utf8'});

    rs.addListener('data', function (chunk) {

      if(debug){
        //console.log("addColorSwatchesToPalette: chunk: ", chunk);
      }

      var chunkFormat = chunk.replace(/[\s]+/igm," ");
      var comment = chunkFormat.replace(/.*(comment[\s]*=[\s]*\{.*\}).*/igm,"$1");
      comment = comment.replace(/(#[a-zA-Z0-9]{6})/igm,"$1,");
      comment = comment.replace(/,[\s]*\}/igm," }");
      comment = comment.replace(/{[\s]*/igm,'{"');
      comment = comment.replace(/\:/igm,'":');
      comment = comment.replace(/(#[a-zA-Z0-9]{6}[\s]*,[\s]*)([\d])/igm,'$1"$2');
      comment = comment.replace(/(#[a-zA-Z0-9]{6})[\s]*,/igm,'$1",');
      comment = comment.replace(/:[\s]*/igm,':"');
      comment = comment.replace(/[\s]*\}/igm,'"}');
      comment = comment.replace(/comment[\s]*=[\s]*/igm,"");
      comment = comment.replace(/\([\s]*([0-9]+)[\s]*,[\s]*([0-9]+)[\s]*,[\s]*([0-9]+)[\s]*\)/igm,"($1,$2,$3)");
      if(debug){
        console.log("addColorSwatchesToPalette: comment: ", comment);
      }
      try{
        comment = JSON.parse(comment);
      }
      catch(e){
        //console.log("addColorSwatchesToPalette: JSON.parse: e: ", e);
      }

      if(debug){
        console.log("addColorSwatchesToPalette: comment: ", comment);
      }

      var colors = [];

      for(var key in comment) {
        var obj: any = {};
        obj['count'] = key;
        var valueArr = comment[key].split(" ");
        var hex = "";
        if(valueArr.length == 2){
          hex = valueArr[1];
        }
        obj['hex'] = hex;
        colors.push(obj);
      }

      colors
      .sort(
        ( a: any, b: any ) => {
          // By using simple subtraction:
          // --
          // ( a.count > b.count ) results in negative number.
          // ( a.count < b.count ) results in positive number.
          // ( a.count == b.count ) results in zero.
          return( b.count - a.count );
        }
      );

      if(imageInfoContainer){

        if(colors.length > 0){

          if(debug){
            console.log("addColorSwatchesToPalette: colors.length: ", colors.length);
          }

          imageInfoContainer.innerHTML = "";

          var swatches = 0;

          if(store.has('swatches') && !isNaN(store.get('swatches')) && store.get('swatches') > 0){
            swatches = parseInt(store.get('swatches'));
          }

          var colorsQty = 0;

          if(debug){
            console.log("addColorSwatchesToPalette: swatchQtyDescArr: ", swatchQtyDescArr);
          }

          swatchQtyDescArr.map( (qty) => {
            if(colors.length <= qty){
              colorsQty = qty;
            }
          });
          
          if(debug){
            console.log("addColorSwatchesToPalette: colorsQty: ", colorsQty);
          }

          colors.map( (color: any) => {
            var div = document.createElement("div");
            div.setAttribute("id","swatch-" + namespace);
            div.setAttribute("class","swatch-" + colorsQty);
            div.setAttribute("style","background:" + color['hex'] + ";");
            imageInfoContainer.appendChild(div);
          });

        }

      }

    });

  }

}



// SELECTORS

var templateCount = 10;

if ('content' in document.createElement("template")) {

  var container = document.querySelector("#container");

  if(container){

    for (var i = 0; i < templateCount; i++) {

      var namespace = i + 1;

      var template: any = document.querySelector("#palette");
      var clone = template.content.cloneNode(true);

      var imageContainer = clone.querySelector("#image-container-0");
      imageContainer.setAttribute("id","image-container-" + namespace);
      var paletteImage = clone.querySelector("#palette-image-0");
      paletteImage.setAttribute("id","palette-image-" + namespace);
      var imageInfoContainer = clone.querySelector("#image-info-container-0");
      imageInfoContainer.setAttribute("id","image-info-container-" + namespace);
      var addImageFileContainerInner = clone.querySelector("#add-image-file-container-inner-0");
      addImageFileContainerInner.setAttribute("id","add-image-file-container-inner-" + namespace);
      var imagefile = clone.querySelector("#imagefile-0");
      imagefile.setAttribute("id","imagefile-" + namespace);
      var addImageInputfileLabel = clone.querySelector("#add-image-inputfile-label-0");
      addImageInputfileLabel.setAttribute("id","add-image-inputfile-label-" + namespace);
      var addImageInputfileTextContainer = clone.querySelector("#add-image-inputfile-text-container-0");
      addImageInputfileTextContainer.setAttribute("id","add-image-inputfile-text-container-" + namespace);
      var addImageInputfileText = clone.querySelector("#add-image-inputfile-text-0");
      addImageInputfileText.setAttribute("id","add-image-inputfile-text-" + namespace);
      var addImageInputfileReset = clone.querySelector("#add-image-inputfile-reset-0");
      addImageInputfileReset.setAttribute("id","add-image-inputfile-reset-" + namespace);

      container.appendChild(clone);

    }

  }

}

displayImagesAndHistograms();

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
  var imageContainer = document.getElementById("image-container-" + namespace);
  var imageInfoContainer = document.getElementById("image-info-container-" + namespace);

  inputfile.addEventListener("change",function(event: any){

    var filepath = event.target.value;

    if(filepath.indexOf("fakepath") != -1){

      var id = event.target.getAttribute("id");
      var currentObj: any = document.getElementById(id); 

      if(currentObj){

        writeFiles(filepath, imageContainer, imageInfoContainer, namespace, currentObj);

      }

    }

    if(debug){
      console.log("app.ts: filepath: ",filepath);
    }

  });

});

const button = Array.prototype.slice.call(document.querySelectorAll(".button"));

button.map( (element: any, idx: number) => {

  element.addEventListener("click",function(event: any){

    var _element = event.currentTarget;

    if(debug){
      console.log("app.ts: _element: ",_element);
    }

    var dataRoleQuantity = _element.getAttribute("data-role-quantity");

    if(debug){
      console.log("app.ts: dataRoleQuantity: ",dataRoleQuantity);
    }

    button.map( (element: any, idx: number) => {
      element.classList.remove("current");
    });

    _element.classList.add("current");

    if (typeof dataRoleQuantity !== typeof undefined && dataRoleQuantity !== false) {

      if(store.has('swatches')){

        store.set('swatches',dataRoleQuantity);

        if(debug){
          console.log("app.ts: button.map: store.get('swatches'): ",store.get('swatches'));
        }

      }
    }

  },false);

});

var swatches = 0;

if(store.has('swatches') && !isNaN(store.get('swatches')) && store.get('swatches') > 0){
  swatches = parseInt(store.get('swatches'));
}

if (swatches > 0) {
  var colorQuantity = document.getElementById("color-quantity-" + swatches);
  if(colorQuantity){
    colorQuantity.classList.add("current");
  }
}



