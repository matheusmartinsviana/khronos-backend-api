require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function sendCustomerSaleReport(email, name, saleData, reportHTML) {
    const mailOptions = {
        from: `"Khronos Vendas" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Relatório de Venda',
        html: reportHTML,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado ao cliente:', info.messageId);
        return !!info.messageId;
    } catch (err) {
        console.error('Erro ao enviar email para cliente:', err);
        return false;
    }
}

async function sendSellerSaleNotification(email, name, saleData, customerData, saleItems) {
    const html = `
        <h3>Venda Realizada</h3>
        <p>Cliente: ${customerData.name}</p>
        <p>Itens vendidos: ${saleItems.map(i => i.name).join(', ')}</p>
    `;

    const mailOptions = {
        from: `"Khronos Vendas" <${process.env.MAIL_FROM}>`,
        to: email,
        subject: 'Nova venda realizada',
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado ao vendedor:', info.messageId);
        return !!info.messageId;
    } catch (err) {
        console.error('Erro ao enviar email para vendedor:', err);
        return false;
    }
}

module.exports = {
    sendCustomerSaleReport,
    sendSellerSaleNotification,
};
