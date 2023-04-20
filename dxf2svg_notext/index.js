const fs = require("fs");
const { readdir, readFile, writeFile, mkdir } = require("node:fs/promises");
const { Helper } = require("dxf");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function readDXFFolder(readDir, writeDir) {
  try {
    const fileNameArray = await readdir(readDir);
    if (!fs.existsSync(writeDir)) {
      await mkdir(writeDir);
    }

    for (let fileName of fileNameArray) {
      const svgFileName = fileName.replace(/\.[^/.]+$/, "");
      const dxfContent = await readDXFFile(readDir, fileName);
      const dxfHelper = new Helper(dxfContent);
      const svg = dxfHelper.toSVG();
      const changedSVG = cleanSVGFile(svg);
      await writeFile(`${writeDir + svgFileName}_cleaned.svg`, changedSVG);
      await writeFile(`${writeDir + svgFileName}.svg`, svg);
      console.log(`${svgFileName}.dxf processed`);
      fileNum++;
    }
  } catch (err) {
    console.error(err);
  }
}

async function readDXFFile(path, fileName) {
  try {
    return await readFile(path + fileName, { encoding: "utf-8" });
  } catch (err) {
    console.error(err);
  }
}

function cleanSVGFile(svgContent) {
  const dom = new JSDOM(svgContent);
  const transforms = dom.window.document.querySelectorAll("g[transform]");

  for (let node of transforms) {
    if (node.parentElement.nodeName === "g") {
      node.parentElement.remove();
    }
  }

  return `<?xml version="1.0"?>\n` + dom.window.document.body.innerHTML;
}

let readDirectory = process.argv[2] || undefined;
let writeDirectory = process.argv[3] || undefined;
let fileNum = 0;

if (!readDirectory) {
  return console.log("Directory for reading DXF is not defined!");
}

if (!writeDirectory) {
  return console.log("Directory for writing SVG is not defined!");
}

(async () => {
  console.time("");
  try {
    await readDXFFolder(readDirectory, writeDirectory);
  } catch (e) {
    console.error(e);
  }
  console.log(`${fileNum} files processed in`);
  console.timeEnd("");
})();
