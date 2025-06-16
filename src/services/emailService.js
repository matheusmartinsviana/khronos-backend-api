const {
    sendCustomerSaleReport,
    sendSellerSaleNotification,
} = require('../repositories/emailRepository');

async function handleCustomerReport(data) {
    return await sendCustomerSaleReport(
        data.customerEmail,
        data.customerName,
        data.saleData,
        data.reportHTML
    );
}

async function handleSellerNotification(data) {
    return await sendSellerSaleNotification(
        data.sellerEmail,
        data.sellerName,
        data.saleData,
        data.customerData,
        data.saleItems
    );
}

async function handleBoth(data) {
    const [customerResult, sellerResult] = await Promise.allSettled([
        handleCustomerReport(data),
        handleSellerNotification(data),
    ]);

    const customerSent = customerResult.status === 'fulfilled' && customerResult.value;
    const sellerSent = sellerResult.status === 'fulfilled' && sellerResult.value;

    return {
        success: customerSent || sellerSent,
        customerSent,
        sellerSent,
    };
}

module.exports = {
    handleCustomerReport,
    handleSellerNotification,
    handleBoth,
};
