const merge = require("webpack-merge")
const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const parts = require("./webpack.parts")
const PATHS = require("./paths")

const commonConfig = merge([
    {
        plugins: [
            new HtmlWebpackPlugin({
                title: "mithril-date-range-picker"
            }),
        ],
    },
    parts.loadJavaScript({ include: PATHS.app }),
])

const productionConfig = merge([
    {
        recordsPath: path.join(__dirname, "records.json"),
        output: {
            chunkFilename: "[name].[chunkhash:4].js",
            filename: "[name].[chunkhash:4].js",
        },
    },
    parts.clean(PATHS.build),
    parts.minifyJavaScript(),
    parts.minifyCSS({
        options: {
            discardComments: {
                removeAll: true,
            },
            safe: true,
        },
    }),
    parts.extractCSS({
        use: ["css-loader?sourceMap", parts.autoprefix()],
    }),
    parts.generateSourceMaps({ type: "source-map" }),
    {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "initial"
                    }
                }
            },
            runtimeChunk: {
                name: "manifest"
            }
        }
    }
])

const developmentConfig = merge([
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
    }),
    parts.loadCSS(),
    parts.generateSourceMaps({ type: "cheap-module-eval-source-map" }),
])

module.exports = mode => {
    if (mode === "production") {
        return merge(commonConfig, productionConfig, { mode })
    }
    return merge(commonConfig, developmentConfig, { mode })
}