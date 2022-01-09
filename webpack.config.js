const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = (env = {}) => ({
    mode: env.dev ? 'development' : 'production',
    entry: path.resolve(__dirname, 'src/index.ts'),
    target: 'node',
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
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new NodemonPlugin({
            script: './dist/server.js',
            watch: path.resolve('./dist'),
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
