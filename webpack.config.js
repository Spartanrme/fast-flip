const TerserPlugin = require("terser-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");

const path = require("path");
const rimraf = require("rimraf");
const util = require("util");

const rimrafAsync = util.promisify(rimraf);

module.exports = async env => {
    let outputPath = env.production
        ? path.resolve(__dirname, "dist")
        : path.resolve(process.env.LOCALAPPDATA, "FoundryVTT", "Data", "modules", "fast-flip");

    await rimrafAsync(outputPath);

    let plugins = [
        new MiniCSSExtractPlugin(),
        new ESLintPlugin(),
        new CopyPlugin({
            patterns: [
                "lang/**/*",
                "icons/**/*.svg",
                "module.json"
            ]
        })
    ];

    if (env.production) {
        plugins = [
            ...plugins,
            new ZipPlugin({
                path: path.join(__dirname, "artifacts"),
                filename: "fast-flip",
            })
        ];
    }

    return {
        entry: "./src/module.ts",
        mode: "production",
        devtool: env.development ? "inline-source-map" : undefined,
        plugins,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    test: /\.less$/,
                    exclude: /node_modules/,
                    sideEffects: true,
                    use: [
                        MiniCSSExtractPlugin.loader,
                        "css-loader",
                        "less-loader",
                    ]
                }
            ],
        },
        resolve: {
            modules: [
                path.resolve(__dirname, "src"),
                path.resolve(__dirname, "node_modules"),
            ],
            extensions: [".ts", ".tsx", ".js"],
        },
        output: {
            filename: "mod.js",
            path: outputPath,
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: false
                    }
                })
            ],
            sideEffects: true
        }
    }
}