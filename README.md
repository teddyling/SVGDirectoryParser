# SVGDirectoryParser
A parser is written in NodeJS that parse all SVG files inside a directory to JSON text. 


This parser is written with NodeJS, so it has to be executed in the Node environment. 

If you do not have Node.js installed on your device, you can download it from https://nodejs.org/en

Please make sure that you are in the svgFileParser before running the parser. 
Before running the parser, please run "npm install" to download the dependencies of this parser.  

The format of the command to run this parser is:
node index.js <readDirectory> <writeDirectory> 

The <readDirectory> can either be a relative directory or an absolute directory. If the readDirectory can not be found, an error will be thrown, and the parsing will not take place. 

The <writeDirectory> can either be a relative directory or an absolute directory. If the writeDirectory can not be found, it will be automatically created, and the txt files containing JSON objects will be located inside. 

Right now, the parser can process 620 SVG files in around 2 minutes and process 5000 SVG files in around 21 minutes. 
