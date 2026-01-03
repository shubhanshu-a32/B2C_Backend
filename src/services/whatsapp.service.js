/**
 * Mock WhatsApp Service
 * Simulates sending messages by logging to the console.
 */
const sendWhatsappMessage = async (to, message) => {
    // console.log(`\n[WHATSAPP MOCK] Sending to ${to}:`);
    // console.log(`---------------------------------------------------`);
    // console.log(message);
    // console.log(`---------------------------------------------------\n`);
    return true;
};

module.exports = { sendWhatsappMessage };