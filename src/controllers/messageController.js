require("dotenv").config();
import { json } from "body-parser";
import request from "request";
const MongoClient = require('mongodb').MongoClient;

let getSummary = (req, res) => {
    
    MongoClient.connect(
        process.env.DB_CONNECTION,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }, 
        function(err, client) {
            if (err){
                throw err;
            } 
            
            console.log("User get summary data");

            // Get database name
            let db = client.db(process.env.DB_NAME);

            // we search if user already in database
            db.collection(process.env.DB_COLLECTION).find({}).toArray(function(err, result) {
                if (err){
                    throw err;
                }

                res.send(result);
            });
        }
    );
};

let getMessage = (req, res) => {
    MongoClient.connect(
        process.env.DB_CONNECTION,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }, 
        function(err, client) {
            if (err){
                throw err;
            } 
            
            console.log("User get message data");

            // Get database name
            let db = client.db(process.env.DB_NAME);

            // we search if user already in database
            db.collection(process.env.DB_COLLECTION2).find({}).toArray(function(err, result) {
                if (err){
                    throw err;
                }

                res.send(result);
            });
        }
    );
};

let getMessageById = (req, res) => {
    
    
    MongoClient.connect(
        process.env.DB_CONNECTION,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }, 
        async function(err, client) {
            if (err){
                throw err;
            } 
            
            console.log("User get one message data");

            // Get database name
            let db = client.db(process.env.DB_NAME);
            // we search if user already in database
             // we search if user already in database
            db.collection(process.env.DB_COLLECTION2).find({}).toArray(function(err, result) {
                if (err){
                    throw err;
                }
                var picked = result.find(mess => mess.id == req.params.id);

                res.send(picked)
            });
        }
    );
};

module.exports = {
  getSummary: getSummary,
  getMessage: getMessage,
  getMessageById: getMessageById
};