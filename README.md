# Assets to map
A plugin for webpack

[![npm version](https://badge.fury.io/js/assets-to-map-webpack-plugin.svg)](https://badge.fury.io/js/assets-to-map-webpack-plugin)
[![Build Status](https://travis-ci.org/ekino/webpack-plugin-assets-to-map.svg?branch=master)](https://travis-ci.org/ekino/webpack-plugin-assets-to-map)


# Summary
- [Main goal](https://github.com/ekino/webpack-plugin-assets-to-map#main-goal)
- [What for?](https://github.com/ekino/webpack-plugin-assets-to-map#what-for)
- [How to use?](https://github.com/ekino/webpack-plugin-assets-to-map#how-to-use)
- [Options](https://github.com/ekino/webpack-plugin-assets-to-map#options)
- [Example](https://github.com/ekino/webpack-plugin-assets-to-map#examples)


## Main goal
Extract bundle(s) generated by webpack and add it in a file JSON or YAML or TOML.

## What for?
Originally we used it on a Hugo.io project: we needed to inline in a template style and script generated by Webpack. 
To do so, we decided to go through /Data repertory to access it with Hugo environment variables `.Data`.

## How to use?

### Install
`$ npm install --save-dev assets-to-map-webpack-plugin`  
or  
`$ yarn add -D assets-to-map-webpack-plugin`


### Implementation
```javascript
module.exports = {
	// more webpack config
	plugins: [
		new AssetsToMap({
			// options
		})
	]
}
```

## Options
- **sourcePath** - `{String}` (default: `""`)  
    Where to find the assets you need to put in the Json file
- **outputPath** - `{String}` (default: `""`)  
    Where to generate the json file
- **filename** - `{String}` (default: `""`)  
    Name of the destination file. *Don't specify the extension*.
- **format** - {String} (default: `"json"`)  
    Possible values:
    - `"json"`
    - `"toml"`
    - `"yaml"`
    (The format will also defines the extension of the output file)
- **files** - `{Object}` **required**  
    Example: `{key: "name"}`
    - `key` will be used as the key in the generated json file
    - `name` is the name of the bundle you're appending to the generated json file.
- **deleteFiles** - `{Bool}` (default: `false`)  
    allows the plugin to delete source files inlined if true
- **verbose** - `{Bool}` (default: `false`)  
    add console.log
    
### Example
The example below will create a file `./site/data/assets.json` containing two keys: `css` (from the file generated by ExtractTextPlugin) and `js`, both located in `./site/static`.
`tracking.js` will not be included in `assets.json` for it's not declared in the `files` option.

```diff
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
+const AssetsToMap = require('assets-to-map-webpack-plugin');

module.exports = {
    entry: {
        main: [
            "./assets/js/app.js",
            "./assets/css/main.css"
        ],
        tracking: "./assets/js/tracking.js",
    },
    output: {
        path: path.join(__dirname, "site/static"),
        filename: "[name].js"
    },
    module: {
        loaders: [
            // ...
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        // JS optimizations like
        // new UglifyJSPlugin(),
+        new AssetsToMap({
+            sourcePath: "site/static/",
+            outputPath: "site/data/",
+            filename: "assets",
+            files: {
+                css: "main.css",
+                js: "main.js"
+            }
+        }),

    ]
};
```

