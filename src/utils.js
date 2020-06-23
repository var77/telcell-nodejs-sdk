exports.getIp = (req) => {
    const ips = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // if the request will pass multiple proxies the ips will be comma separated strings ip,ip
    return ips.split(',')[0];
};

exports.isTrustedIp = (ips, ip) => {    
    if (!ips || ips.length === 0) return true;

    return ips.includes(ip);
};

exports.getXMLResponse = (data) => {
    let xml = `<?xml version=”1.0” encoding=”windows-1251”?>
            <response>`;

    for (const key in data) {
        const openBracket = `<${key}>`;
        const closeBracket = `</${key}>`;
        
        const content = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
        xml += `${openBracket}${content}${closeBracket}`;
    }

    xml += '</response>';

    return xml;
};