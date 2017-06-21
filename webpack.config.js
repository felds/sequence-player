var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
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
        port: 9000,
        publicPath: "/dist",
        host: '10.0.12.33'
    },
};
