
import { IpcService } from "./IpcService";
import AppPaths from './AppPaths';

import * as electron from 'electron';

import * as path from 'path';
import * as imagemagick from 'imagemagick-darwin-static';
import * as graphicsmagick from 'graphicsmagick-static';
import * as os from 'os';
import * as gm from 'gm';
import * as fs from "fs";
import * as fse from "fs-extra";

import * as Store from "electron-store";


// GLOBALS

var debug = true;

var $rootDir = "dist";
var $src = $rootDir;

const configDir =  (electron.app || electron.remote.app).getPath('userData');
const appDir =  (electron.app || electron.remote.app).getAppPath();

const  isPackaged = appDir.indexOf('app.asar') !== -1;

if(isPackaged){
  
  $rootDir = "resources/dist";
  var regex = /(.*)app.asar.*/igm;
  $src = appDir.replace(regex,"$1") + "dist";

  var targetDir = configDir + "\\dist\\app\\assets";
  var sourceDir = $src + "\\app\\assets";

  var targetDistDir = configDir + "\\dist";
  var targetAppDir = configDir + "\\dist\\app";
  var targetHistogramsDir = configDir + "\\dist\\app\\assets\\histograms";
  

  //if(debug){
    console.log('app.ts: targetDir: ',targetDir);
    console.log('app.ts: sourceDir: ',sourceDir);

    console.log('app.ts: targetDistDir: ',targetDistDir);
    console.log('app.ts: targetAppDir: ',targetAppDir);
    console.log('app.ts: targetHistogramsDir: ',targetHistogramsDir);
    
  //}
  
  

  if (!fs.existsSync(targetDistDir)){
    fs.mkdirSync(targetDistDir);
    if (fs.existsSync(targetDistDir) && !fs.existsSync(targetAppDir)){
      fs.mkdirSync(targetAppDir);
    }
    if (fs.existsSync(targetAppDir) && !fs.existsSync(targetDir)){
      fs.mkdirSync(targetDir);
    }
  }

  try {
    if (!fs.existsSync(targetHistogramsDir)){
      fse.copySync(sourceDir,targetDir);
      if (fs.existsSync(targetDistDir)){
        $rootDir = targetDistDir;
        $src = targetDistDir;
      }
    }
    console.log('success!')
  } catch (err) {
    console.error(err)
  }

  
}

//if(debug){
  console.log('app.ts: configDir: ',configDir);
  console.log('app.ts: appDir: ',appDir);
  console.log('app.ts: isPackaged: ',isPackaged);
  console.log('app.ts: $rootDir: ',$rootDir);
  console.log('app.ts: $src: ',$src);
//}

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

if(debug){
  console.log(process.env);
}

// METHODS

function find(outers: any, selector: string, first: boolean) {

  var outers = (arguments[0] != null) ? arguments[0] : null;
  var selector: string = (arguments[1] != null) ? arguments[1] : "";
  var first: boolean = (arguments[2] != null) ? arguments[2] : true;

  var found_elements: any = [];

  for(var i=0; i<outers.length; i++) {

    var elements_in_outer = outers[i].querySelectorAll(selector);

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

    return img.noProfile().bitdepth(8).colors(swatches).write("histogram:" + $rootDir + "/app/assets/histograms/" + histogramFilename, function (err) {

      addColorSwatchesToPalette(imageInfoContainer, $rootDir + "/app/assets/histograms/" + histogramFilename,namespace);

      this.write($rootDir + "/app/assets/images/output/" + outputimageFilename, function (err: any) {

        if(!err){
          if(debug){
            console.log("app.ts: output file created");
          }
          addImageToImageConatiner(imageContainer, $src + "/app/assets/images/output/" + outputimageFilename, namespace);
        }

      });

    });
    
  }

}

function displayImagesAndHistograms(){

  var outputDir = $rootDir + "/app/assets/images/output/";
  var outputDirSrc = $src + "/app/assets/images/output/";

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

        addImageToImageConatiner(imageContainer, outputDirSrc + outputimageFilename, namespace);

        var histogramFilename: string = namespace + "_histogram.miff";

        if(fileExists($rootDir + "/app/assets/histograms/" + histogramFilename)){

          if(debug){
            console.log("app.ts: files.forEach: namespace: ",namespace);
          }

          var imageInfoContainer = document.getElementById("image-info-container-" + namespace);

          addColorSwatchesToPalette(imageInfoContainer, $rootDir + "/app/assets/histograms/" + histogramFilename,namespace);

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
        if(debug){
          console.log("addColorSwatchesToPalette: JSON.parse: e: ", e);
        }
      }

      if(debug){
        console.log("addColorSwatchesToPalette: comment: ", comment);
      }

      var colors = [];

      for(var key in comment) {
        var obj: any = {};
        obj['count'] = key;
        var valueArr = comment[key].split(" ");
        var rgb = "";
        if(valueArr.length > 0){
          rgb = valueArr[0];
        }
        obj['rgb'] = "rgb" + rgb;
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
            console.log("addColorSwatchesToPalette: colors: ", colors);
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

          var imageDataContainer = document.querySelector("#image-data-container-" + namespace);

          colors.map( (color: any, idx: number) => {
            var div = document.createElement("div");
            div.setAttribute("id","swatch-" + namespace + "-" + (idx + 1));
            div.setAttribute("class","swatch-" + colorsQty + " swatch-squares-" + namespace + " swatch-squares");
            div.setAttribute("style","background:" + color['hex'] + ";");
            div.setAttribute("data-clicks","0");
            if(imageDataContainer){
              div.addEventListener("click", function(event: any){
                const swatchSquares = Array.prototype.slice.call(document.querySelectorAll(".swatch-squares-" + namespace));
                swatchSquares.map( (_element: any, _idx: number) => {
                  var id1 = _element.getAttribute("id");
                  var id2 = div.getAttribute("id");
                  if(id1 != id2){
                    _element.setAttribute("data-clicks","0");
                  }
                });
                var clicks = 0;
                if("clicks" in div.dataset){
                  clicks = parseInt(div.dataset.clicks);
                }
                clicks++;
                if(clicks > 2){
                  clicks = 0;
                }
                if(debug){
                  console.log("addColorSwatchesToPalette: namespace: ", namespace," idx: ", idx," clicks: ", clicks);
                }
                switch (clicks) {
                  case 1:
                    imageDataContainer.innerHTML = '<span style="background:' + color['hex']+ ';"></span><span>' + color['hex'] + '</span>';
                    break;
                  case 2:
                    imageDataContainer.innerHTML = '<span style="background:' + color['hex']+ ';"></span><span>' + color['rgb'] + '</span>';
                    break;  
                  default:
                    imageDataContainer.innerHTML = "";
                    break;
                }
                div.dataset.clicks = "" + clicks + "";
              });
              /* div.addEventListener("mouseover", function(event: any){
                imageDataContainer.innerHTML = '<span>' + color['hex'] + '</span>';
              }); */
            }
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
      var imageDataContainer = clone.querySelector("#image-data-container-0");
      imageDataContainer.setAttribute("id","image-data-container-" + namespace);
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

button.map( (element: any, idx: number) => {

  if(debug){
    console.log("app.ts: element: ",element);
  }

  var dataRoleQuantity = element.getAttribute("data-role-quantity");

  if(debug){
    console.log("app.ts: dataRoleQuantity: ",dataRoleQuantity);
  }

  if (typeof dataRoleQuantity !== typeof undefined && dataRoleQuantity !== false) {

    var src = $src + "/app/assets/svg/mdi-palette.svg";

    var img = document.createElement("img");
    img.setAttribute("id","image-quantity-" + dataRoleQuantity);
    img.setAttribute("src",src);
    element.appendChild(img);

  }

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



