This is a transformer that will transform an engineering drawing DXF file to an SVG file but ignore all texts and most of the dimension lines.

This parser is written with NodeJS, so it has to be executed in the Node environment.

Please make sure that you are located in the dxf2svg_notext directory before running the parser.
Before running the parser, please run "npm install" to download the dependencies of this parser.

The format of the command to run this parser is:
node index.js "readDirectory" "writeDirectory"
Substitute the readDirectory and the writeDirectory with your specified directories.

The "readDirectory" can either be a relative directory or an absolute directory. If the readDirectory can not be found, an error will be thrown, and the parsing will not take place.

The "writeDirectory" can either be a relative directory or an absolute directory. If the writeDirectory can not be found, it will be automatically created, and the svg files will be located inside.
