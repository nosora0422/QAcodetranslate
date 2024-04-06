'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

module.exports = {
    mode: 'development',
    entry: {
        index: './index.html',
        translate: './translate.html'
    },
    output: {
        filename: '[name]bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true
    },
    plugins: getHtmlPlugins(),
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    }
};

// function getEntries() {
//     const entries = {};
//     const htmlFiles = glob.sync('./*.html'); // Update path as needed
//     htmlFiles.forEach(file => {
//         const name = path.basename(file, '.html');
//         entries[name] = file;
//     });
//     return entries;
// }

function getHtmlPlugins() {
    const plugins = [];
    const htmlFiles = glob.sync('./*.html'); // Update path as needed
    htmlFiles.forEach(file => {
        plugins.push(
            new HtmlWebpackPlugin({
                filename: path.basename(file), // Output file name
                template: file,
                chunks: [path.basename(file, '.html')]
            })
        );
    });
    return plugins;
}
