const { axiosInstance } = require("./axios");
const WebSocket = require("ws");

function sendMessage(messageObj, messageText) {
    return axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

async function handleMessage(messageObj) {
    // Check if messageObj is defined
    if (!messageObj) {
        console.error("messageObj is undefined");
        return;
    }

    const messageText = messageObj.text || "";
    const contractAddress = '2e9Dh3WZWj2CcnGDgRWkqWzyKdpeKkTMTj87vRGEpump'
    if (messageText.charAt(0) === "/") {
        const command = messageText.substr(1);
        switch (command) {
            case "start":
                return sendMessage(
                    messageObj,
                    "Hi Ya Guys, I'm starting Msok Eidooo!"
                );
            case "add":
                const tradeResult = await tradeMethod(messageObj, contractAddress); // Wait for tradeMethod to complete
                return sendMessage(messageObj, tradeResult);
            case "ca":
                return axiosInstance.get("sendMessage", {
                    chat_id: messageObj.chat.id,
                    text: `asdasd`,
                });
            case "":
                return '';
            default:
                return sendMessage(messageObj, "Sorry, I don't know that command :)");
        }
    } else {
        return sendMessage(messageObj, messageText);
    }
}

async function tradeMethod(messageObj, contractAddress) {
    const ws = new WebSocket("wss://pumpportal.fun/api/data");

    return new Promise((resolve, reject) => {
        ws.on("open", function open() {
            // Subscribing to token creation events
            let payload = {
                method: "subscribeNewToken",
            };
            ws.send(JSON.stringify(payload));

            // Subscribing to trades made by accounts
            payload = {
                method: "subscribeAccountTrade",
                keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"], // array of accounts to watch
            };
            ws.send(JSON.stringify(payload));

            // Subscribing to trades on tokens
            payload = {
                method: "subscribeTokenTrade",
                keys: contractAddress, // array of token CAs to watch
            };
            ws.send(JSON.stringify(payload));
        });

        ws.on("message", function message(data) {
            resolve(data); // Resolve the promise with the received data
            return sendMessage(messageObj, data);
        });

        ws.on("error", function error(err) {
            reject(err); // Reject the promise if there's an error
        });
    });
}

module.exports = { handleMessage };