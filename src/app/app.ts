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


function rgbToHex(red: any, green: any, blue: any) {

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

gm("src/app/assets/images/for-palette/1.jpg").size(function(err, value){
  // note : value may be undefined
  console.log("app.ts: value: ",value);
})

/* gm("src/app/assets/images/for-palette/1.jpg").identify(function(err, value){
  // note : value may be undefined
  console.log("app.ts: value: ",value);
}) */

// SELECTORS

/*const imageContainer = Array.prototype.slice.call(document.querySelectorAll(".image-container"));

imageContainer.map( (element: any, idx: number) => {

  var filepath = "";

  var id = element.getAttribute("id");
  var currentObj: any = document.getElementById(id); 
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

    var outputimageFilename: string = namespace + "_out_image." + _fileext;

    var img = document.createElement("img");
    img.setAttribute("id","image-" + namespace);
    img.setAttribute("src","src/app/assets/images/output/" + outputimageFilename);
    imageContainer.appendChild(img);

  }

});*/

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

      var img = document.createElement("img");
      img.setAttribute("id","image-" + namespace);
      img.setAttribute("src",outputDir + outputimageFilename);
      imageContainer.appendChild(img);

    });

  });

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

        var outputimageFilename: string = namespace + "_out_image." + _fileext;
        var histogramFilename: string = namespace + "_histogram.miff";

        var img = gm(filepath);

        return img.noProfile().bitdepth(8).colors(50).write("histogram:src/app/assets/histograms/" + histogramFilename, function (err) {

          var histogram, rs;
          histogram = '';
          rs = fs.createReadStream("src/app/assets/histograms/" + histogramFilename, {encoding: 'utf8'});

          rs.addListener('data', function (chunk) {

            if(debug){
              //console.log("Data: ", chunk);
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
            //comment = comment.replace(/\}/igm,'}}');
            comment = JSON.parse(comment);
            //var commentObj = strToObj(comment);
            //var commentObj = JSON.parse(comment);

            if(debug){
              console.log("comment: ", comment);
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

            if(debug){
              console.log("colors: ", colors);
            }

            /* var regex = /\d+/igm;

            var colors = chunk.split( "\n" )
            .map(
              ( line: any ) => {
                var numbers = line.match(regex);
                var count = parseInt( numbers[ 0 ] );
                var red = parseInt( numbers[ 1 ] );
                var green = parseInt( numbers[ 2 ] );
                var blue = parseInt( numbers[ 3 ] );
                return({
                  count: count,
                  hex: rgbToHex( red, green, blue )
                });
              }
            )
            // Sort the colors so that the most frequent colors are listed first.
            .sort(
              ( a: any, b: any ) => {
                // By using simple subtraction:
                // --
                // ( a.count > b.count ) results in negative number.
                // ( a.count < b.count ) results in positive number.
                // ( a.count == b.count ) results in zero.
                return( b.count - a.count );
              }
            )

            if(debug){
              console.log("colors: ", colors);
            } */

          });

          this.write("src/app/assets/images/output/" + outputimageFilename, function (err: any) {

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
            }

          });

        })
        

        /* var readStream = fs.createReadStream(filepath);

        gm(readStream)
        .size({bufferStream: true}, function(err: any, size: any) {

          this.resize(160,160,"!");

          this.depth({bufferStream: true}, function(err: any, depth: any) {

            this.bitdepth(8);

            this.color({bufferStream: true}, function(err: any, color: any) {

              this.background("#ffffff");
              this.dither(true);
              this.matte();
              this.colorspace("rgb");
              this.colors(50);

              var outputimageFilename: string = namespace + "_out_image." + _fileext;
              var histogramFilename: string = namespace + "_histogram.miff";
              this.write("src/app/assets/images/output/" + outputimageFilename, function (err: any) {

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
                }

                gm("src/app/assets/images/output/" + outputimageFilename).command("convert").write("src/app/assets/histograms/" + histogramFilename, function (err: any) {

                  if(!err){
                    if(debug){
                      console.log("app.ts: histogram created");
                    }
                  }

                  gm("src/app/assets/histograms/" + histogramFilename).identify('%c', function (err: any, format: any) {

                    if(!err){
                      if(debug){
                        console.log("app.ts: format: ",format);
                      }
                    }

                  });

                });

              });

            });

          });

        }); */

      }
    }
    if(debug){
      console.log("app.ts: filepath: ",filepath);
    }

  });

});


