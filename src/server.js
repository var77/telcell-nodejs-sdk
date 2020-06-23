const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { getIp, isTrustedIp, getXMLResponse } = require('./utils');
const GetTelCellSDK = require('./sdkFactory');


function GetServer (configs, onCheck, onPayment, onStatus, onRates) {

    const { port = 8080, host = '127.0.0.1', basePath = '/' } = configs;

    const SDK = GetTelCellSDK(onCheck, onPayment, onStatus, onRates);


    const _restirctIp = ips => (req, res, next) => {
        if (!isTrustedIp(ips, getIp(req)))
            return res.send(getXMLResponse({ code: 403, message: 'Access Denied' }))

        return next();
    }

    const _jwtAuth = secret => (req, res, next) => {
        try {
            const data = jwt.verify(req.headers.authorization.split(' ')[1], secret);
            req.query.jwtData = data;

            return next();
        } catch (err) {
            console.error(err);
            return res.send(getXMLResponse({ code: 403, message: 'Access Denied' }))
        }
    }
    

    const _getRouter = () => {
        const router = express.Router()
        router.get('/', _handleRequest);

        return router;
    }

    const _handleRequest = async (req, res) => {
        try {
            res.set('Content-Type', 'application/xml');
            const { action } = req.query;

            if (action === 'check')
                return res.send(await SDK.checkHandler(req.query));
            
            if (action === 'payment')
                return res.send(await SDK.paymentHandler(req.query));

            if (action === 'status')
                return res.send(await SDK.statusHandler(req.query));

            if (action === 'rate')
                return res.send(await SDK.rateHandler(req.query));

            res.send(getXMLResponse({ code: 400, message: `Action ${req.query.action} not permitted` }));
        } catch (err) {
            console.error(err);
            res.send(getXMLResponse({ code: 500, message: 'Internal Server Error' }));
        }
    }

    const _start = (middlewares = [], cb = () => null) => {
        const app = express();

        app.use(bodyParser.json());
        app.use(cors());

        const router = _getRouter();

        app.use(basePath, ...middlewares, router);

        app.listen(port, host, () => {
            console.log(`🚀 TelCell API Started on http://${host}:${port}`);
            console.log(`🚀 Request url is http://${host}:${port}${basePath}`);
            cb();
        });
    }

    return {
        start: _start,
        getRouter: _getRouter,
        middlewares: {
            restirctIp: _restirctIp,
            jwtAuth: _jwtAuth
        }
    };

}

module.exports = GetServer;
