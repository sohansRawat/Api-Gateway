const express = require('express');
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const {AuthRequestMiddlewares}=require('./middlewares')

const app = express();

//Rate limiter
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(limiter)

app.use('/flightsService',[AuthRequestMiddlewares.checkAuth,AuthRequestMiddlewares.isFlightCompany],createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));
app.use('/bookingsService', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    console.log('update');
});

// [AuthRequestMiddlewares.checkAuth,AuthRequestMiddlewares.isFlightCompany]
