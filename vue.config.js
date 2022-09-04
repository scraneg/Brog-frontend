module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://www.brogs.cn:8200',
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ''
                },
            }
        }
    }
}