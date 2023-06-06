var axios = require('axios');
var configController = require('../config/jwt.secret')
function sendMessage(data) {
    var config = {
        method: 'post',
        url: configController.whatappUrl,
        headers: {
            'Authorization': `Bearer ${configController.bearerToken}`,
            'Content-Type': 'application/json'
        },
        data: data
    };

    return axios(config)
}



function getTextMessageInput(recipient, text) {
    // return JSON.stringify({
    //     "messaging_product": "whatsapp",
    //     "recipient_type": "individual",
    //     "to": recipient,
    //     "type": "template",
    //     "template": {
    //         "name": "hello_world",
    //         // "body": text,
    //         "language": {
    //             "code": "en_US"
    //         }
    //     }
    // });
    return JSON.stringify({
        "messaging_product": "whatsapp",
        "to": "919545154311",
        "type": "template",
        "template": {
            "name": "hello_world",
            "language": {
                "code": "en_US"
            }
        }
    })
}

module.exports = {
    sendMessage: sendMessage,
    getTextMessageInput: getTextMessageInput
};