class SVG_File {
  constructor(fileName, width, height) {
    this.filename = fileName;
    this.width = width;
    this.height = height;
    this.paths = [];
  }
}

class SVG_Path {
  constructor(color) {
    this.id = null;
    this.color = color;
    this.operations = null;
    this.bounding_box = null;
  }
}

class SVG_Path_Bbox {
  constructor(x1, y1, x2, y2, text) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    text && (this.text = text);
  }
}

module.exports = { SVG_File, SVG_Path, SVG_Path_Bbox };
