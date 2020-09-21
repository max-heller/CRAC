const path = require("path");
const srcDir = '../src/';

module.exports = {
    entry: {
        inject: path.join(__dirname, srcDir + "inject.ts"),
        'safari-cr-fetcher': path.join(__dirname, srcDir + "safari-cr-fetcher.ts"),
        background: path.join(__dirname, srcDir + "background.ts")
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
