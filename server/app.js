const express = require("express");
require('dotenv').config();
const mysql = require('mysql');


const dbConfig = require("./database/database");
const Message = require("./models/messages");
const messageData = new Message();
const Quotes = require("./models/quotes");
const quoteData = new Quotes();

const dbConn = mysql.createPool(dbConfig);
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// routes for messages.

app.get("/messages", (req, res) => {
    dbConn.query("SELECT * FROM messages", 
    (err, results) => {
        if (err) {
            res.status(404).send("Cannot retrieve data. Please try again later.");
        } else {
            res.status(200).send(results);
        }
    })
})

app.post("/messages", (req, res) => {
    const message = {
        name : req.body.name,
        email : req.body.email,
        message : req.body.message
    };
    messageData.postMessage(message);
    res.status(200).send(message);

});

app.delete("/message/:id", (req, res) => {
    dbConn.query("DELETE FROM messages WHERE messages_id = ?", 
    [req.params.id], 
    (err, results) => {
        if (err) {
            res.status(404).send("Message does not exist.");
        } else if (err == null) {
            res.status(200).send("Message was deleted.")
        }
    });
})

// routes for quotes.

app.get("/quotes", (req, res) => {
    quoteData.getQuotes(res);
});

app.post("/quotes", (req, res) => {
    const quote = {
        quotes_content: req.body.content,
        quotes_author: req.body.author
    };
    quoteData.postQuote(quote, res);
})

app.delete("/quotes/:id", (req, res) => {
    const quoteId = req.params.id;
    quoteData.deleteQuote(quoteId, res);
})



app.listen(port, () => console.log(`Server is running on port ${port}`));

