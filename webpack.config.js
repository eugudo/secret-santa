const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = (env = {}) => ({
    mode: env.dev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/index.ts'),
    externalsPresets: { node: true },
    externals: [nodeExternals()],
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'public'),
    },
    plugins: [
        new NodemonPlugin({
            script: './public/server.js',
            watch: path.resolve('./public'),
            ignore: ['*.js.map'],
            ext: 'js,njk,json',
            delay: '1000',
            verbose: true,
            env: {
                NODE_ENV: 'development',
            },
        }),
    ],
});
