var webpack = require('webpack');
var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var { generateManifest } = require("plugin-api/build/generateManifest");

function getConfig(isProduction) {
    var isDebug = !isProduction;

    var sourceRoot = path.join(__dirname, "src");
    var nodeModulesPath = path.join(__dirname, "node_modules");
    var outputRoot = path.join(__dirname, "dist");

    var plugins = [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(".", "tsconfig.json"),
            tslint: path.resolve(".", isProduction ? "tslint.prod.json" : "tslint.json"),
            async: false
        }),
        // These are preprocessor constants which are replaced inline (that's why the extra quotes)
        new webpack.DefinePlugin({
            // This is needed to be able to activate some features for development (like ReduxDevTools)
            // and, also, some libs (like React) have an optimized (smaller&faster) builds
            // if NODE_ENV is set to "production"
            'process.env.NODE_ENV': JSON.stringify(isDebug ? 'development' : 'production'),
            '__plugin_manifest__': JSON.stringify(generateManifest(require("./package.json")))
        })
    ];

    if (!isDebug) {
        plugins.push(new webpack.HashedModuleIdsPlugin());
    }

    return {
        mode: isDebug ? "development" : "production",
        context: sourceRoot,
        entry: './plugin',
        output: {
            path: outputRoot,
            sourcePrefix: '',
            crossOriginLoading: "anonymous",
            filename: "index.js",
            chunkFilename: "[contentHash].bundle.js",
            pathinfo: !!isDebug,
            library: "__adetante__besu",
            libraryTarget: "jsonp"
        },
        optimization: isDebug ? void 0 : {
            minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        // Don't merge statements with comma. This makes breakpoints unusable in debugger.
                        compress: {
                            sequences: false,
                            join_vars: false,
                            // Dropping unused variables causes problems with libraries such as MobX
                            unused: false,
                            warnings: false,
                            // FIX https://github.com/mishoo/UglifyJS2/issues/1317
                            if_return: false,
                            // FIX https://github.com/mishoo/UglifyJS2/issues/2498
                            properties: false
                        },
                        mangle: {
                            safari10: true
                        }
                    },
                    sourceMap: true
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    enforce: "pre",
                    loader: "source-map-loader"
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader?configFile=tsconfig.json',
                    options: {
                        transpileOnly: true
                    }
                }
            ]
        },
        resolve: {
            modules: [
                sourceRoot,
                nodeModulesPath
            ],
            extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
        },
        externals: [
            { "react": "commonjs react" },
            { "react-dom": "commonjs react-dom" },
            { "mobx": "commonjs mobx" },
            { "mobx-react": "commonjs mobx-react" },
            { "styled-components": "commonjs styled-components" },
            function(context, request, callback) {
                if (/^plugin-api\/.+$/.test(request)) {
                    return callback(null, 'commonjs ' + request);
                }
                callback();
            },
        ],
        // If incremental build performance becomes an issue, this option can be enabled
        // to generate faster source maps
        devtool: /*isDebug ? 'eval-source-map' : */'source-map',
        // Uncomment this to use polling instead of file watchers (e.g. too few available
        // from environment)
        watchOptions: {
            aggregateTimeout: 0
            //poll: true
        },
        plugins: plugins
    };

}

module.exports = getConfig;
