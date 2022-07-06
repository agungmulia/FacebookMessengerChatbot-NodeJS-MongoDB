import request from "request";
import chatBotService from "../services/chatBotService";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_TOKEN;

//for getting users profile name
let getFacebookUsername = (sender_psid) =>{
    return new Promise ((resolve,reject)=>{
        let uri = `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`
        request({
            "uri": uri,
            "method": "GET",
        }, (err, res, body) => {
            if (!err) {
                body = JSON.parse(body);
                let username = `${body.first_name} ${body.last_name}`;
                resolve(username);
            } else {
                reject("Unable to send message:" + err);
            }
        });
    });
    

};

module.exports = {
    getFacebookUsername:getFacebookUsername
};