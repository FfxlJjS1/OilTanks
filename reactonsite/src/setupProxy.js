const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/api/Tank",
    "api/Calculator",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7092',
        secure: false
    });

    app.use(appProxy);
};
