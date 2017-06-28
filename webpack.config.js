var path = require('path');

module.exports = {
    entry: {
        "sequence-player": './src/index.js',
        editor: './src/editor.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test:       /\.js$/,
                use:        { loader: 'babel-loader', options: { presets: [ 'env', 'stage-0' ] } },
            },
            {
                test:       /\.css$/,
                use:        [ 'style-loader', 'css-loader' ],
            },
        ]
    },
    devServer: {
        inline: true,
        overlay: true,
        publicPath: "/dist",
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 9000,
    },
};
