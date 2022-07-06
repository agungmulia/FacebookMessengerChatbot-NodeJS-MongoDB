require("dotenv").config();
import request from "request";
const { json } = require("body-parser");

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

let getHomepage = (req, res) => {
    return res.render("homepage.ejs");
};

let getFacebookUserProfile = (req, res) => {
    return res.render("profile.ejs");
};

let getFacebookUserMessages = (req, res) => {
    return res.render("message.ejs");
};

//created for future project
let setUserFacebookProfile = (req,res) => {
    // Send the HTTP request to the Messenger Platform
    let data = {
        "get_started":{
            "payload":"GET_STARTED"
        },
        "persistent_menu": [
            {
                "locale": "default",
                "composer_input_disabled": false,
                "call_to_actions": [
                    {
                        "type": "postback",
                        "title": "Read a brief about me",
                        "payload": "about_me"
                    }
                ]
            }
        ],
        "whitelisted_domains":[
            "https://agungchatbot.herokuapp.com/"
          ]
    };
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messenger_profile",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": data
    }, (err, res, body) => {
        if (!err) {
            return res.status(200).json({
                "message":"Setup done"
            })
        } else {
            return res.status(500).json({
                "message":"Error from the node server"
            })
        }
    });
    return res.status(200).json({
        message: "ok"
    })
};

module.exports = {
    getHomepage: getHomepage,
    getFacebookUserProfile: getFacebookUserProfile,
    setUserFacebookProfile: setUserFacebookProfile
};
