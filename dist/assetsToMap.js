"use strict";

var fs = require('fs');
var prefixLog = "[assetsToMap]    ";

function AssetsToMap(options) {
    this.files = options.files ? options.files : {};
    this.format = options.format ? options.format : "json";
    this.sourcePath = options.sourcePath ? options.sourcePath : "";
    this.outputPath = options.outputPath ? options.outputPath : "";
    this.filename = options.filename ? options.filename : "asset.json";
    this.deleteFiles = options.deleteFiles ? options.deleteFiles : false;
    this.verbose = options.verbose ? options.verbose : false;

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

    var resultObj = {};
    var resultStr = "";

    if (Object.keys(this.files).length === 0) {
        console.error("[assetsToMap]    No files provided");
        return;
    }

    var _loop = function _loop(key) {
        if (!_this2.files.hasOwnProperty(key)) {
            console.error(`${prefixLog}no key provided for ${_this2.files[key]}`);
            return {
                v: void 0
            };
        }

        //read existing contents into data
        switch (_this2.format) {
            case "toml":
                resultStr += `${key} = '''
                ${fs.readFileSync(_this2.sourcePath + _this2.files[key]).toString('UTF-8')}'''
                \n`;
                break;
            case "yaml":
                resultStr += `${key} : |
                ${fs.readFileSync(_this2.sourcePath + _this2.files[key]).toString('UTF-8').replace(/[\r\n]+/g, " ")}'''
                \n`;
                break;
            default:
                resultObj[key] = fs.readFileSync(_this2.sourcePath + _this2.files[key]).toString('UTF-8');
                break;
        }

        if (_this2.verbose) {
            console.info(`${prefixLog}${_this2.sourcePath}${_this2.files[key]} added to ${_this2.outputPath}${_this2.filename}`);
        }

        if (_this2.deleteFiles) {
            fs.unlink(_this2.sourcePath + _this2.files[key], function (err) {
                if (err) {
                    throw err;
                }
                if (_this2.verbose) {
                    console.info(`${prefixLog}${_this2.sourcePath}${_this2.files[key]} was deleted`);
                }
            });
        }
    };

    for (var key in this.files) {
        var _ret = _loop(key);

        if (typeof _ret === "object") return _ret.v;
    }

    fs.writeFileSync(this.outputPath + this.filename + "." + this.format, new Buffer(this.format === "yaml" || this.format === "toml" ? resultStr : JSON.stringify(resultObj)));

    if (this.verbose) {
        console.info(`${prefixLog}${this.outputPath}${this.filename} was created`);
    }
};

module.exports = AssetsToMap;