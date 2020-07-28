module.exports = function (env) {
    var config = {
        devtool: 'source-map',
        resolve: { extensions: ['.js', '.json'] },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        }
    };

    return config;
};