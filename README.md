# TelCell Nodejs SDK

### Attention this is not an official SDK

## Installation

`yarn add https://github.com/var77/telcell-nodejs-sdk`

### Use as a server
```
const { GetServer } = require('telcell-nodejs-sdk');


const serverConfigs = {
    port: 3031,
    basePath: '/telcell'
};

// return string
const onCheck = (payload) => {
    console.log('Check passed return product info');
    console.log(payload);
    // get your user info here

    // if you want to return an object use JSON.stringify
    // example: return JSON.stringify({ name: 'Անուն', lastName: 'Ազգանուն' });

    return 'Անուն Ազգանուն'
}

// return string (response message )
const onPayment = async (payload) => {
    console.log('Payment check passed return order info');
    console.log('Payload is::', payload);

    // process your order here

    return 'Payment successfull';
}

// return order date here
const onStatus = async (payload) => {
    console.log('Payment status passed return order date');
    console.log('Payload is::', payload);

    // get your order info here

    return new Date();
}

// return { [productId]: rate }
const onRates = async (payload) => {
    console.log('Payment rate passed return product rates');
    console.log('Payload is::', payload);

    // get your rates here
    return { rate: 20 };
}


const TelCellServer = GetServer(serverConfigs, onCheck, onPayment, onStatus, onRates);

const telcellIps = ['127.0.0.1'];
const secret = 'mySecretToken123!';

const ipCheckMiddleware = TelCellServer.middlewares.restirctIp(telcellIps);
const jwtAuthMiddlewate = TelCellServer.middlewares.jwtAuth(secret);

TelCellServer.start([ipCheckMiddleware, jwtAuthMiddlewate]);
 // this will start an express server with the defined middlewares which can also be empty or your custom middlewares

// if you want to inject the routes to your own express server you can user
/*
 const router = TelCellServer.getRouter();
 myApp.use(router);
*/

// if you want to use the SDK functions on your own check examples/sdk.js
```

### jwtAuthMiddlewate

When using this middleware the request coming from TelCell Servers should contain `Authorization: JWT $JWT_TOKEN` Header signed with your secret
`payload.jwtData` will be de decoded JWT data

### ipCheckMiddleware
When using this middleware it will verify the ip address to be matched with your predefined ips.

### TODO

 - Add Tests
