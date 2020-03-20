const sgMail = require('@sendgrid/mail');
const mysql = require('mysql');


const dbConfig = require("../database/database");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const dbConn = mysql.createPool(dbConfig);


class Message {
    sendMessage(messageObj) {
        const msg = {
            to: process.env.DELIVERY_EMAIL,
            from: messageObj.email,
            subject: 'Portfolio Message',
            text: messageObj.message
        };
        sgMail.send(msg);
    }

    postMessage(messageObj) {
        let insertData = {
            messages_name: messageObj.name,
            messages_email: messageObj.email,
            messages_message: messageObj.message
        }
        dbConn.query("INSERT INTO messages SET ?", 
        [insertData], 
        (err, results) => {
            if (err != null) {
                res.status(400).send("An error occurred. Please try again later");
            } else if (err == null) {
                this.sendMessage(messageObj);
            }
        })
    }
}

module.exports = Message;