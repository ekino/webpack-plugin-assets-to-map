const fs = require('fs');
const prefixLog = "[assetsToMap]    ";

function AssetsToMap(options = {}) {
    this.files = options.files ? options.files : {};
    this.format = options.format ? options.format : "json";
    this.sourcePath = options.sourcePath ? options.sourcePath : "";
    this.outputPath = options.outputPath ? options.outputPath : "";
    this.filename = options.filename ? options.filename : "asset.json";
    this.deleteFiles = options.deleteFiles ? options.deleteFiles : false;
    this.logger = options.logger ? options.logger : {error: () => {}, info: () => {}};

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
    let resultObj = {};
    let resultStr = "";

    if (Object.keys(this.files).length === 0) {
        this.logger.error(`${prefixLog}No files provided`);
        return false;
    }

    for (const key in this.files) {

        //read existing contents into data
        switch (this.format){
            case "toml":
                resultStr += `${key} = '''
                ${fs.readFileSync(this.sourcePath + this.files[key]).toString('UTF-8')}'''
                \n`;
                break;
            case "yaml":
                resultStr += `${key} : |
                ${fs.readFileSync(this.sourcePath + this.files[key]).toString('UTF-8').replace(/[\r\n]+/g, " ")}'''
                \n`;
                break;
            default:
                resultObj[key] = fs.readFileSync(this.sourcePath + this.files[key]).toString('UTF-8');
                break;
        }

        this.logger.info(`${prefixLog}${this.sourcePath}${this.files[key]} added to ${this.outputPath}${this.filename}`);

        // TODO: deleteFiles at the very end
        if(this.deleteFiles){
            fs.unlink(this.sourcePath + this.files[key], (err) => {
                if (err) {
                    throw err
                }
                this.logger.info(`${prefixLog}${this.sourcePath}${this.files[key]} was deleted`);
            });
        }
    }

    fs.writeFileSync(this.outputPath + this.filename + "." + this.format, new Buffer(
        (this.format === "yaml" || this.format === "toml") ? resultStr :  JSON.stringify(resultObj)
    ));

    //TODO: delete files now.

    this.logger.info(`${prefixLog}${this.outputPath}${this.filename} was created`);

    return true;
};

module.exports = AssetsToMap;