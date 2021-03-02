const mode = process.env.NODE_ENV || 'development';

module.exports = {
    publicPath: '.',
    configureWebpack: {
        devtool: (mode === 'development') ? 'inline-source-map' : false,
        mode: mode,
        optimization: {
            splitChunks: {
                minSize: 10000,
                maxSize: 250000,
            },
            mangleWasmImports: true,
            removeAvailableModules: true,
            concatenateModules: true
        },
    },

}