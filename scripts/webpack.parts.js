const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const UglifyWebpackPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const cssnano = require("cssnano")


exports.devServer = ({ host, port } = {}) => ({
    devServer: {
        stats: "errors-only",
        host,
        open: true,
        overlay: true,
    }
})

exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [require("postcss-cssnext")()],
                        },
                    },
                ]
            }
        ]
    }
})

exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        plugins: () => [require("autoprefixer")()]
    }
})

exports.extractCSS = ({ include, exclude, use }) => { // Output extracted CSS to a file
    const plugin = new ExtractTextPlugin({
        allChunks: true,
        filename: "[name].[hash:4].css",
    });
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include,
                    exclude,
                    use: plugin.extract({
                        use,
                        fallback: "style-loader",
                    }),
                }
            ]
        },
        plugins: [plugin]
    }
}

exports.loadJavaScript = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.js$/,
                include,
                exclude,
                use: "babel-loader"
            }
        ]
    }
})

exports.generateSourceMaps = ({ type }) => ({
    devtool: type
})

exports.minifyJavaScript = () => ({
    optimization: {
        minimizer: [new UglifyWebpackPlugin({ sourceMap: true })]
    }
})

exports.clean = path => ({
    plugins: [new CleanWebpackPlugin([path], { allowExternal: true })]
})

exports.minifyCSS = ({ options }) => ({
    plugins: [
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano, cssProcessorOptions: options, canPrint: false
        })
    ]
})