# Assets to map
A plugin for webpack

## Main goal
Extract bundle(s) generated by webpack and add it in a json file.

## What for?
Originally we used it on a Hugo.io project: we needed to inline in a template style and script generated by Webpack. To do so, we decided to go through /Data repertory to access it with Hugo environment variables.

## How to use?
```
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
- sourcePath: ""
Where to find the assets you need to put in the Json file
- outputPath: ""
Where to generate the json file
- filename: ""
Name of the json file
- files: {
  key: "name"
}
key will be used as the key in the generated json file
name is the name of the bundle you're appending to the generated json file.
- deleteFiles: (true|false) (default: false)
allows the plugin to delete source files inlined if true
- verbose: (true|false) (default: false)
add console.log
### Examples
``` javascript
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsToMap = require('./assetsToMap');

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
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1, minimize: true } },
                        'postcss-loader'
                    ],
                }),
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        // JS optimizations
        new UglifyJSPlugin(),
        new AssetsToMap({
            sourcePath: "site/static/",
            outputPath: "site/data/",
            filename: "assets.json",
            files: {
                css: "main.css",
                js: "main.js",
                tracking: "tracking.js",
                loadCSS: "loadCss.js",
            }
        }),

    ]
};
```

