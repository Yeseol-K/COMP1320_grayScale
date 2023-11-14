/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs/promises"),
  { createReadStream, createWriteStream} = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");
  const AdmZip = require("adm-zip");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  try {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    console.log("Extraction operation complete");
  } catch (error) {
      console.log(error.message);
  }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir).then((files) => {
    let arr = [];
    files.forEach(file => {
      if (path.extname(file) === ".png") {
        arr.push(path.join(dir, file));
      }
    }) 
    return arr;
  })
}
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (filePath, pathProcessed) => {
  return new Promise ((resolve, reject) => {
    createReadStream(filePath)
    .pipe(new PNG())
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          const r = this.data[idx];
          const g = this.data[idx + 1];
          const b = this.data[idx + 2];
    
          const gray = (r+g+b)/3;
    
          this.data[idx] = gray;
          this.data[idx + 1] = gray;
          this.data[idx + 2] = gray;
        }
      }
      this.pack().pipe(createWriteStream(pathProcessed))
        .on("finish", () => resolve())
        .on("error", (err) => reject(err));
      });
  }); 
};

const invertColors = (filePath, pathProcessed) => {
  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(new PNG())
      .on("parsed", function () {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            this.data[idx] = 255 - this.data[idx];
            this.data[idx + 1] = 255 - this.data[idx + 1];
            this.data[idx + 2] = 255 - this.data[idx + 2];
          }
        }
        this.pack().pipe(createWriteStream(pathProcessed))
          .on("finish", () => resolve())
          .on("error", (err) => reject(err));
      });
  });
};


module.exports = {
  unzip,
  readDir,
  grayScale,
  invertColors
};

