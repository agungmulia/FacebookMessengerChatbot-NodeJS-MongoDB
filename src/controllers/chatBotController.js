require("dotenv").config();
import { json } from "body-parser";
import request from "request";
import chatBotService from "../services/chatBotService"

const Summary = require ("../models/Messages");
const Message = require ("../models/Message");
const MongoClient = require('mongodb').MongoClient;


let userFirstName = "";
let userBirthDate = "";
let nameAlreadyFilled = "";
let finalMessage = false;
let userId = "";
let userName ="";
let userMes = [];
let userSingleMes = "";
let messId =0;

let COUNT_MESSAGES = 0;
let ARRAYOF_MESSAGES = [];
let summaryData = "";

function findMessage(message, id = userId){
    for(let i = 0; i < message.length; i++){
        if(message[i].userId === id){
            return i;
        }
    }
    return -1;
}

// function to add a message to DB
let postMessage = async (req, res) => {
    let MongoClient = require('mongodb').MongoClient;
    userName = await chatBotService.getFacebookUsername(userId);
    // creating the message object
    let obj = new Summary({
        userId: userId,
        userName: userName,
        text: userMes
    });

    let messageObj = new Message({
        id: messId,
        text: userSingleMes
    });

    // connect to mongo client
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
            
            console.log("Connected to the server for inserting message");

            // Get database name
            let db = client.db(process.env.DB_NAME);
            //this post is for message collection
            db.collection(process.env.DB_COLLECTION2).insertOne(messageObj, function(error, res) {
                if (error) {
                    throw error;
                }
                
                console.log(userName + " insert a message");
            });

            // we search if user already in database
            db.collection(process.env.DB_COLLECTION).find({}).toArray(function(err, result) {
                if (err){
                    throw err;
                }
                // find mussage
                let userMessage = findMessage(result);

                // if user data not in database
                if (userMessage < 0){
                    db.collection(process.env.DB_COLLECTION).insertOne(obj, function(error, res) {
                        if (error) {
                            throw error;
                        }
                        
                        console.log(userName + " start a message");
                        client.close();
                    });
                }else{// if user in database, the data is updated so 1 summary is for one user only
                    let usrArrMess = result[userMessage].text;
                    console.log("User messages: " + usrArrMess);

                    db.collection(process.env.DB_COLLECTION).updateOne(
                        {_id : result[userMessage]._id},
                        {$set : {text : userMes}}
                    )

                    console.log(userName + " insert one messages");
                }
            });
        }
    );
    messId+=1;
}

let postWebhook = async (req, res) =>{
    userName = await chatBotService.getFacebookUsername(userId);
    // Parse the request body from the POST
    let body = req.body;
    console.log("Username = "+userName);

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            userId = sender_psid;
            console.log('Sender PSID: ' + sender_psid);

            // initialize object
            let obj = {
                "id" : 0,
                "text": "text"
            }
   
            obj.id = ARRAYOF_MESSAGES.length;

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
              COUNT_MESSAGES += 1;

              obj.text = webhook_event.message.text;
              userSingleMes = webhook_event.message.text;
              
              if(COUNT_MESSAGES%2==1){
                ARRAYOF_MESSAGES.push(obj);
                userMes.push(obj.text);
                postMessage(req, res);
              }
              
              handleMessage(sender_psid, webhook_event.message);
          } else if (webhook_event.postback) {
              COUNT_MESSAGES += 1;

              obj.text = webhook_event.postback.payload;
              userSingleMes = webhook_event.postback.payload;
              if(COUNT_MESSAGES%2==1){
                ARRAYOF_MESSAGES.push(obj);
                userMes.push(obj.text);
                postMessage(req, res);
              }
              handlePostback(sender_psid, webhook_event.postback);
          }
        });
        

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
    
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

//for get started payload
let handlePostback = async (sender_psid, received_postback)=> {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Send the message to acknowledge the postback
    switch(payload){
        case "GET_STARTED":
             response = {
              "text": "Hello! Would you like to answer few questions?",
              "quick_replies":[
                {
                  "content_type":"text",
                  "title":"Sure",
                  "payload": "sure"
                },{
                  "content_type":"text",
                  "title":"No",
                  "payload": "not now"
                }
              ]
            }
          callSendAPI(sender_psid,``, response);
            break;
        case "CURATION":
          callSendAPI(sender_psid,`Hmmm.. I think just to be alive is my achievement.. any ways wanna answer some question?`);
          break;
        case "about_me":
          callSendAPI(sender_psid,`My name is Agung Mulia Eko Putra, I'm a student from Atma Jaya Yogyakarta University...`);
          break;
          callSendAPI(sender_psid,``, response);

    }
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response, quick_reply={"text": ""}) {
    // Construct the message body
    let request_body;

    if(!quick_reply.text){
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": { "text": response }
        };
    }
    else{
        request_body = {
            "recipient": {
                "id": sender_psid
            },
            "messaging_type": "RESPONSE",
            "message": quick_reply
        };
    }
    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!');
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

//this function handle message
function handleMessage(sender_psid, message) {
  let mess = message.text;
  mess = mess.toLowerCase();

  let response;

  try {//for layering, I divide categories of messages into their own part
      if (message.quick_reply) {
        handleQuickReply(sender_psid, message);
      } else if (message.text) {
        handleTextMessage(sender_psid, message);
      } else if (message.attachments){
        callSendAPI(sender_psid,`This bot doesnt accept an attachment yet..`);
      }
      else{
          callSendAPI(sender_psid,`The bot needs more training. You said "${message.text}". Try to say"start again" to restart the conversation..`);
      }
  } 
  catch (error) {
      console.error(error);
      callSendAPI(sender_psid,`An error has occured: '${error}'. We have been notified and will fix the issue shortly!`);
    }
}

function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}


// handle Facebook Natural Language Processing
let handleMessageWithEntities = (message) => {
  let entitiesArr = ["wit$greetings", "wit$thanks", "wit$bye" ];
  let entityChosen = "";
  let data = {}; // data is an object saving value and name of the entity.
  entitiesArr.forEach((name) => {
      let entity = firstTrait(message.nlp, name.trim());
      if (entity && entity.confidence > 0.8) {
          entityChosen = name;
          data.value = entity.value;
      }
  });

  data.name = entityChosen;

  // checking language
  if (message && message.nlp && message.nlp.detected_locales) {
      if (message.nlp.detected_locales[0]) {
          let locale = message.nlp.detected_locales[0].locale;
          data.locale = locale.substring(0, 2)
      }

  }
  return data;
};

function handleTextMessage(sender_psid, message) {

    let mess = message.text;
    mess = mess.toLowerCase();

    let response;
    
    //there is no nlp for acceptance and deny so i create a string of array that contains the value
    let accept = ["yup","i do", "sure", "yeah", "yep", "yes"];
    let deny = ["no", "not now", "nah", "maybe later" , "nope"];

    let entity = handleMessageWithEntities(message);

    // init conversation
    if(mess === "start again"){
        userFirstName = "";
        userBirthDate = "";
        nameAlreadyFilled = "";
        finalMessage = false;
        
        ARRAYOF_MESSAGES = [];
        COUNT_MESSAGES = 0;
    }

    //if message is a greeting or using get started button
  if(entity.name === "wit$greetings" || mess === "start again" || mess === "get started"){
      if(userFirstName === ""){
          response = {
              "text": "Hello! Would you like to answer few questions?",
              "quick_replies":[
                {
                  "content_type":"text",
                  "title":"Sure",
                  "payload": "sure"
                },{
                  "content_type":"text",
                  "title":"No",
                  "payload": "not now"
                }
              ]
            }
          callSendAPI(sender_psid,``, response);
      } else{
          callSendAPI(sender_psid,`The bot is in developement. your message is "${message.text}". Try to say "start again" to restart the conversation.`);
      }
  } else if(accept.includes(mess)){ //iff accepted input value and name is still empty
    if(userFirstName === "" && userBirthDate ===""){
        callSendAPI(sender_psid,`Great! First, please tell us your first name`);
    }else if(finalMessage == true){
        callSendAPI(sender_psid,`You have already taken the question, say "start again" to take another question`);
    }else{//accept for if user wants to know their birthday or not
        if(countBirthDays() === -1 || isNaN(countBirthDays())){
          callSendAPI(sender_psid,`Birth date input is invalid. your message ${userBirthDate} are If you want to start this conversation again write "start again".`);
        }
        else{
            callSendAPI(sender_psid,`There are ${countBirthDays()} days until your next birthday! Say "start again" to take another question`);
            finalMessage = true;
        }
    }  
  } else if (deny.includes(mess)){ //all deny message is considered end of answer
    callSendAPI(sender_psid,`Thank you for your answer. If you wish to start this conversation again write "start again"`);
  } else if (entity.name === "wit$bye"){//nlp bye
    callSendAPI(sender_psid,`Goodbye! , If you wish to start this conversation again write "start again"`);
  } else if (entity.name === "wit$thanks"){//nlp thanks
      callSendAPI(sender_psid,`You're welcome and Goodbye! , If you wish to start this conversation again write "start again"`);
  }
  else if (!isNaN(isDate(mess)) && nameAlreadyFilled!==""){//if a value is considered date and name parameter is already filled
    let resp = {
      "text": `Your birth date is ${mess}. Would you like to know how many days are until your next birtday?`,
      "quick_replies":[
        {
          "content_type":"text",
          "title": "yes",
          "payload": "no"
        },{
          "content_type":"text",
          "title":"No",
          "payload": "not interested"
        }
      ]
  };

  userBirthDate = mess;

  callSendAPI(sender_psid,``, resp);
  }
  else {//because I dont add any dialog, any message is considered a name
    callSendAPI(sender_psid,`your first name is ${capitalizeFirstLetter(mess)}? Next, can we know your birth date (YYYY-MM-DD)`);


    nameAlreadyFilled = mess;
  }
    // Sends the response message
    callSendAPI(sender_psid, response);    
  }

  //fuction to see input value is a date
function isDate(value){
  var newVal = new Date(value)
  return newVal;
}

// function to handle replies
function handleQuickReply(sender_psid, message){
  let mess = message.text;
  mess = mess.toLowerCase();

  // this part is for answer in the replies group
  if(mess === "get started"){
        callSendAPI(sender_psid,`Great! First, please tell us your first name`);
  }else if(mess === "sure"){
      if(!userFirstName && finalMessage != true){
          callSendAPI(sender_psid,`Great! First, please tell us your first name`);
      }else if(finalMessage == true) {
          callSendAPI(sender_psid,`You have already taken the question, say "start again" to take another question`);
      }
      else {
          callSendAPI(sender_psid,`The bot needs more training, Try to say "Start again" to restart the conversation :)`);
      }
  }
  // user agreed to know birth date days
  else if (mess === "yes"){
      // Invalid input
      if(countBirthDays() === -1 || isNaN(countBirthDays())){
          callSendAPI(sender_psid,`Birth date input is invalid. your message ${userBirthDate} are If you want to start this conversation again write "start again".`);
      }else if(finalMessage == true){ // valid information -> proceed to calculus
          callSendAPI(sender_psid,`You have already taken the question, say "start again" to take another question`);
          finalMessage = true;
      } else{ // valid information -> proceed to calculus
          callSendAPI(sender_psid,`There are ${countBirthDays()} days until your next birthday! Say "start again" to take another question`);
          finalMessage = true;
      }
  }
  else if (mess === "not now" || mess === "no" || mess === "not at all" || mess === "not interested"){
          callSendAPI(sender_psid,`Goodbye 🖐, If you wish to start this conversation again write "start again"`);
  }
  else {
      callSendAPI(sender_psid,`The bot needs more training, Try to say "Start again" to restart the conversation :)`);
  }
}

function countBirthDays(){
    var today = new Date();
    var userInputDate = new Date(userBirthDate);

    // false input
    if(userInputDate.getFullYear() >= today.getFullYear() || userInputDate.getMonth() > 12 || userInputDate.getDay() > 31){
        return -1;
    }
    else{ 
        userInputDate.setFullYear(today.getFullYear());
        if(today > userInputDate){
            userInputDate.setFullYear(today.getFullYear() + 1);
        }
            let count_days =  Math.round((userInputDate.getTime() - today.getTime()) / (1000*60*60*24));
            return count_days;
        
    }
}

// function to capitalize first letter of a word
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  postWebhook: postWebhook,
  postMessage: postMessage,
  getWebhook: getWebhook,
};