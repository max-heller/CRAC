const path = require("path");

module.exports = {
    entry: {
        inject: path.join(__dirname, "src/inject.ts"),
        background: path.join(__dirname, "src/background.ts")
    },
    output: {
        path: path.join(__dirname, "dist/js"),
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
        extensions: [".ts", ".tsx", ".js"]
    }
};
