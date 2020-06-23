const { getXMLResponse } = require('./utils');

const nop = () => null;

function TelcellSDKFactory (onCheck = nop, onPayment = nop, onStatus = nop, onRates = nop) {


    const checkHandler = async (payload) => {
        const response = await onCheck(payload);

        if (!response)
            return getXMLResponse({ code: 404, message: 'Not found' });
        
        
        return getXMLResponse({ code: 0, message: response });
    }
    
    const paymentHandler = async (payload) => {
        const response = await onPayment(payload);
        
        return getXMLResponse({ code: 0, message: response || 'Transaction successful' });
    }

    const statusHandler = async (payload) => {
        const date = await onStatus(payload);
        
        if (!date)
            return getXMLResponse({ code: 404, message: 'Order not found' });

        return getXMLResponse({ code: 200, message: 'Order completed', date });
    }

    const rateHandler = async (payload) => {
        const rates = await onRates(payload);
        
        if (!rates)
            return getXMLResponse({ code: 404, message: 'Rates not found' });

        return getXMLResponse(rates);
    }

    return {
        checkHandler,
        paymentHandler,
        statusHandler,
        rateHandler
    }
}

module.exports = TelcellSDKFactory;