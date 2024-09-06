const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => ({
    plugins: [
        new NodePolyfillPlugin(),
        new CompressionPlugin(),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "url": require.resolve("url/")
        }
    }
});
