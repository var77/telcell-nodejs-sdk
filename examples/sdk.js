const { GetSDK } = require('../');


const onCheck = (payload) => {
    console.log('Check passed return product info');
    console.log(payload);
    // get your user info here

    // if you want to return an object use JSON.stringify
    // example: return JSON.stringify({ name: 'Անուն', lastName: 'Ազգանուն' });

    return 'Անուն Ազգանուն'
}

const onPayment = async (payload) => {
    console.log('Payment check passed return order info');
    console.log('Payload is::', payload);

    // process your order here

    return true;
}

const onStatus = async (payload) => {
    console.log('Payment status passed return order date');
    console.log('Payload is::', payload);

    // get your order info here

    return new Date();
}

const onRates = async (payload) => {
    console.log('Payment rate passed return product rates');
    console.log('Payload is::', payload);

    // get your rates here
    return { rate: 20 };
}

const SDK = GetSDK(onCheck, onPayment, onStatus, onPayment);

// this will just convert your returned object from callback functions to XML

const checkResponse = SDK.checkHandler({});
const paymentResponse = SDK.paymentHandler({});
const ratesResponse = SDK.rateHandler({});
const statusResponse = SDK.statusHandler({});
