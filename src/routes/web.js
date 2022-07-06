import express from "express";
import homepageController from "../controllers/homepageController";
import chatBotController from "../controllers/chatBotController";
import messageController from "../controllers/messageController";

let router = express.Router();

let initWebRoutes = async (app) => {
    router.get("/", homepageController.getHomepage);
    router.get("/webhook", chatBotController.getWebhook);
    router.get("/profile", homepageController.getFacebookUserProfile);
    router.get("/summary", messageController.getSummary);
    router.get("/message/:id", messageController.getMessageById);
    router.get("/message", messageController.getMessage);

    router.post("/webhook", chatBotController.postWebhook);
    router.post("/set-up-user-fb-profile",homepageController.setUserFacebookProfile)
    router.post("/", chatBotController.postMessage);
    
    return app.use("/", router);
};

module.exports = initWebRoutes;