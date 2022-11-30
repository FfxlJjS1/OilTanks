const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7092',
        secure: false
    });

    app.use(appProxy);
};
