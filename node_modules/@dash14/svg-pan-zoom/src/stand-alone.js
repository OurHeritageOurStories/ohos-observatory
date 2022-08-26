var svgPanZoom = require("./svg-pan-zoom.js");
var Utils = require("./utilities");

// UMD module definition
(function (_this) {
  // AMD
  if (typeof define === "function" && define.amd) {
    define("svg-pan-zoom", function () {
      return svgPanZoom;
    });
    // CMD
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = svgPanZoom;

    // Browser
    // Keep exporting globally as module.exports is available because of browserify
    _this.svgPanZoom = svgPanZoom;
  }
})(Utils.getGlobalThis());
