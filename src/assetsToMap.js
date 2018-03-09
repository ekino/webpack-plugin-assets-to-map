const fs = require('fs');
const prefixLog = "[assetsToMap]    ";

function AssetsToMap(options) {
    this.files = options.files ? options.files : {};
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
    compiler.plugin('after-emit', (compilation, callback) => {
        this.writeFile();
        callback();
    });
};

/**
 * Writes an asset to disk
 */
AssetsToMap.prototype.writeFile = function () {
    const result = {};

    if (Object.keys(this.files).length === 0) {
        console.error("[assetsToMap]    No files provided");
        return;
    }

    for (const key in this.files) {
        if (!this.files.hasOwnProperty(key)) {
            console.error(`${prefixLog}no key provided for ${this.files[key]}`);
            return;
        }

        //read existing contents into data
        result[key] = fs.readFileSync(this.sourcePath + this.files[key]).toString('UTF-8');

        if(this.verbose){
            console.info(`${prefixLog}${this.sourcePath}${this.files[key]} added to ${this.outputPath}${this.filename}`);
        }

        if(this.deleteFiles){
            fs.unlink(this.sourcePath + this.files[key], (err) => {
                if (err) {
                    throw err
                }
                if(this.verbose) {
                    console.info(`${prefixLog}${this.sourcePath}${this.files[key]} was deleted`);
                }
            });
        }
    }

    fs.writeFileSync(this.outputPath + this.filename, new Buffer(
        JSON.stringify(result)
    ));

    if(this.verbose) {
        console.info(`${prefixLog}${this.outputPath}${this.filename} was created`);
    }
};

module.exports = AssetsToMap;