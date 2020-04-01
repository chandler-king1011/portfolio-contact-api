const mysql = require('mysql');


const dbConfig = require("../database/database");
const dbConn = mysql.createPool(dbConfig);

class Quotes {
    getQuotes(res) {
        dbConn.query("SELECT * FROM quotes", 
        (err, results) => {
            if (err) {
                res.status(500).send("Not found");
            } else {
                res.status(200).send(results);
            }
        })
    }

    postQuote(quote, res) {
        dbConn.query("INSERT INTO quotes SET ?",
        [quote],
        (err, results) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({"message": "Quote posted successfully.", "results": results});
            }
        })
    }

    deleteQuote(id, res) {
        dbConn.query("DELETE FROM quotes WHERE quotes_id = ?",
        [id],
        (err, results) => {
            if(err) {
                res.status(404).send("No quote under this id.");
            } else {
                res.status(200).send({"message": "Quote deleted successfully.", "results": results});
            }
        })
    }

}

module.exports = Quotes;