"use strict";

var fs = require('fs');
var prefixLog = "[assetsToMap]    ";
function AssetsToMap(options) {

    this.files = options.files ? options.files : {};
    this.sourcePath = options.sourcePath ? options.sourcePath : "";
    this.outputPath = options.outputPath ? options.outputPath : "";
    this.filename = options.filename ? options.filename : "asset.json";

    if (this.sourcePath !== "" && this.sourcePath.slice(-1) !== "/") {
        this.sourcePath += "/";
    }

    if (this.outputPath !== "" && this.outputPath.slice(-1) !== "/") {
        this.outputPath += "/";
    }
}

AssetsToMap.prototype.apply = function (compiler) {
    var _this = this;

    compiler.plugin('after-emit', function (compilation, callback) {
        _this.writeFile();
        callback();
    });
};

/**
 * Writes an asset to disk
 */
AssetsToMap.prototype.writeFile = function () {
    var _this2 = this;

    var result = {};

    if (Object.keys(this.files).length === 0) {
        console.error("[assetsToMap]    No files provided");
        return;
    }

    var _loop = function _loop(key) {

        if (!_this2.files.hasOwnProperty(key)) {
            // do your computation here.
            console.error(`${prefixLog}no key provided for ${_this2.files[key]}`);
            return {
                v: void 0
            };
        }

        //read existing contents into data
        result[key] = fs.readFileSync(_this2.sourcePath + _this2.files[key]).toString('UTF-8');
        console.info(`${prefixLog}${_this2.sourcePath}${_this2.files[key]} added to ${_this2.outputPath}${_this2.filename}`);

        fs.unlink(_this2.sourcePath + _this2.files[key], function (err) {
            if (err) throw err;
            console.info(`${prefixLog}${_this2.sourcePath}${_this2.files[key]} was deleted`);
        });
    };

    for (var key in this.files) {
        var _ret = _loop(key);

        if (typeof _ret === "object") return _ret.v;
    }

    fs.writeFileSync(this.outputPath + this.filename, new Buffer(JSON.stringify(result)));

    console.info(`${prefixLog}${this.outputPath}${this.filename} was created`);
};

module.exports = AssetsToMap;