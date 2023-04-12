const fs = require("fs");
const { readdir, readFile, writeFile, mkdir } = require("node:fs/promises");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const parseSVG = require("svg-path-parser");
const svgPathBbox = require("svg-path-bbox");
const ntc = require("ntc");

const { SVG_File, SVG_Path, SVG_Path_Bbox } = require("./classes");

const COLOR = {
  "#000000": "Black",
  "#ff0000": "Red",
  "#0000ff": "Blue",
  "#00ff00": "Green",
  "#ff007f": "Pink",
  "#ffff00": "Yellow",
  "#ffffff": "White",
};
// const readDirectory = "5/";
// const writeDirectory = "test/";
let fileNum = 0;

async function readSVGFolder(readDir, writeDir) {
  try {
    const fileNameArray = await readdir(readDir);
    if (!fs.existsSync(writeDirectory)) {
      await mkdir(writeDirectory);
    }

    for (let fileName of fileNameArray) {
      //console.log(fileName);
      const svgContent = await readSVGFile(readDir, fileName);
      //console.log(svgContent);
      const svgFileJson = parseSVGFile(fileName, svgContent);
      const textFileName = fileName.replace(/\.[^/.]+$/, "");
      await writeFile(`${writeDir + textFileName}.txt`, svgFileJson);
      fileNum++;
      console.log(`${fileName} processed!`);
    }
  } catch (err) {
    console.error(err);
  }
}

// This function will take the directory name and the filename as input, read the content of that file, and return the content as a string.
async function readSVGFile(path, fileName) {
  try {
    return await readFile(path + fileName, { encoding: "utf-8" });
  } catch (err) {
    console.error(err);
  }
}

//This function takes the content of an SVG file and its filename.
//An SVG_File object will be created, filled, and finally stringified and returned as a JSON string.
function parseSVGFile(fileName, svgContent) {
  const dom = new JSDOM(svgContent);
  const svgPaths = dom.window.document.querySelectorAll("path");
  const file_object = new SVG_File();
  file_object.filename = fileName;
  file_object.height = dom.window.document
    .querySelector("svg")
    .getAttribute("height");
  file_object.width = dom.window.document
    .querySelector("svg")
    .getAttribute("width");

  let path_id = 0;

  for (let svgPath of svgPaths) {
    const style = parseStyle(svgPath.getAttribute("style"));
    const path_object = new SVG_Path(style);
    path_object.id = path_id;
    const commandArray = parseSVG(svgPath.getAttribute("d"));

    path_object.operations = commandArray.map((obj) => ({ ...obj }));
    const [x1, y1, x2, y2] = svgPathBbox(svgPath.getAttribute("d"));
    const hrefTextElement = svgPath.parentElement;
    const pathText = hrefTextElement.getAttribute("xlink:href") || null;

    path_object.bounding_box = bboxToObject(x1, y1, x2, y2, pathText);
    file_object.paths.push(path_object);
    path_id++;
  }
  const file_json = objectToJson(file_object);
  return file_json;
}

// This function will take the style string (from the SVG path's style attribute) and return the color of this path as a string.
function parseStyle(styleString) {
  const styleArray = styleString.split("; ");
  const styleObj = {};
  styleArray.forEach((el) => {
    const pair = el.split(": ");
    styleObj[pair[0]] = pair[1];
  });

  return styleObj;
}
// This function will take the two bounding points of a bounding box rectangle and return a bounding_box object.
//This object will later be added to the SVG_Path object as a property.
function bboxToObject(x1, y1, x2, y2, text) {
  return new SVG_Path_Bbox(x1, y1, x2, y2, text);
}
// This function will transform any object into a well-formatted JSON string.
function objectToJson(obj) {
  return JSON.stringify(obj, null, 4);
}

// Main execution

let readDirectory = process.argv[2] || undefined;
let writeDirectory = process.argv[3] || undefined;

if (!readDirectory) {
  return console.log("SVG Directory for reading is not defined!");
}

if (!writeDirectory) {
  return console.log("SVG Directory for writing is not defined!");
}

if (readDirectory[readDirectory.length - 1] != "/") {
  readDirectory += "/";
}

if (writeDirectory[writeDirectory.length - 1] != "/") {
  writeDirectory += "/";
}

console.time("");
readSVGFolder(readDirectory, writeDirectory).then(() => {
  console.log(`${fileNum} files parsed in:`);
  console.timeEnd("");
});
