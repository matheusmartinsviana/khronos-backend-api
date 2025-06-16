const { validateEmailConfig } = require('../utils/validateEmailConfig');
const {
    handleCustomerReport,
    handleSellerNotification,
    handleBoth,
} = require('../services/emailService');

async function sendEmail(req, res) {
    const configValidation = validateEmailConfig();
    if (!configValidation.isValid) {
        return res.status(400).json({
            success: false,
            error: 'Configurações de email inválidas',
            details: configValidation.errors,
        });
    }

    const { type, ...data } = req.body;

    try {
        switch (type) {
            case 'customer_report':
                const customerSuccess = await handleCustomerReport(data);
                return res.json({
                    success: customerSuccess,
                    message: customerSuccess
                        ? 'Email enviado para o cliente'
                        : 'Falha ao enviar email para o cliente',
                });

            case 'seller_notification':
                const sellerSuccess = await handleSellerNotification(data);
                return res.json({
                    success: sellerSuccess,
                    message: sellerSuccess
                        ? 'Email enviado para o vendedor'
                        : 'Falha ao enviar email para o vendedor',
                });

            case 'both':
                const result = await handleBoth(data);
                return res.json({
                    ...result,
                    message: `Cliente: ${result.customerSent ? 'Enviado' : 'Falhou'}, Vendedor: ${result.sellerSent ? 'Enviado' : 'Falhou'
                        }`,
                });

            default:
                return res.status(400).json({ success: false, error: 'Tipo de email inválido' });
        }
    } catch (error) {
        console.error('Erro no controller:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message || 'Erro desconhecido',
        });
    }
}

module.exports = {
    sendEmail,
};
