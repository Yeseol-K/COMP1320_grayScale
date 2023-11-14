const path = require("path");

/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

//grayscaled
IOhandler.unzip(zipFilePath, pathUnzipped) //sync doesn't need promise chain
IOhandler.readDir(pathUnzipped)
.then((imgs) => { 
  let promArr = [];
    imgs.forEach((i, index) => {
      const grayImg = path.join(__dirname, "grayscaled", `in_${index}.png`);
      promArr.push(IOhandler.grayScale(i, grayImg));
    })
    Promise.all([
      promArr
    ]).then(() => console.log("All images done"))
      .catch(err => console.log(err))
    })

//inverted colors
IOhandler.unzip(zipFilePath, pathUnzipped) //sync doesn't need promise chain
IOhandler.readDir(pathUnzipped)
.then((imgs) => { 
  let promArr = [];
    imgs.forEach((i, index) => {
      const inverImg = path.join(__dirname, "inverted", `in_${index}.png`);
      promArr.push(IOhandler.invertColors(i, inverImg));
    })
    Promise.all([
      promArr
    ]).then(() => console.log("All images done"))
      .catch(err => console.log(err))
    })