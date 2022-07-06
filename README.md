# Facebook Messenger Chatbot using NodeJS and MongoDB
![bandicam 2022-07-06 07-46-06-940_1](https://user-images.githubusercontent.com/90015124/177462773-bd8e7d0e-3eb6-4aa2-b155-b5f2351e25a5.gif)

## REST Endpoint Documentation
### URL/message
![image](https://user-images.githubusercontent.com/90015124/177463002-970b89c7-d331-4613-86a3-994654a180fc.png)

### URL/message/:id
![image](https://user-images.githubusercontent.com/90015124/177463202-9899519f-a628-424e-ac90-0963e4219757.png)

### URL/message/:id
![image](https://user-images.githubusercontent.com/90015124/177463288-979c406e-f9ce-4f50-9472-c4a010d945a3.png)


## The Task
1. Be able to run Facebook Messenger webhook.
2. When a user starts a conversation, say `Hi` and ask a few questions:
    1. User's first name
    2. User’s birthdate. To make it simpler, you can assume there's only one valid date format `YYYY-MM-DD`
    3. Ask if the user wants to know how many days till his next birthday. 
    This is a yes/no answer and the bot should accept both user text answers 
    (`"yes", "yeah", "yup", "no”, "nah"`, etc.) or quick reply buttons.
        1.  If the user says **yes** to the last question, send him a message: 
        `There are <N> days left until your next birthday`
        2. If the user says **no**, just say: `Goodbye 👋`
3. Within the same app, create a REST endpoints: 
    1. `/messages` that list all messages received from users
    2. `/messages/:id` to view single message by its ID
    3. `/summary` to view this data exact data
    
    ```json
    [
     { user: <user_id>, name: <user_name>, messages: [<list_of_users_messages>] }
     { user: <user_id>, name: <user_name>, messages: [<list_of_users_messages>] }
     ...
    ]
    ```
    
4. If you have an idea - feel free to add something extra to the app!
- It is important to use a database as the persistence layer rather than runtime memory as DB
- Tested code are a big bonus point


### How to Run This Project
1. Clone this Github repository
2. Change the .env.example file to .env and customize them with your own variables
3. Deploy your project to Heroku so the webhook will be active and can be used.
4. Create a Facebook page for your bot with only send message button activated.
5. Create you Facebook Developer app [here](https://developers.facebook.com/).
6. Adjust your variables such ass Facebook PageID,token, etc with your Facebook app and config your Facebook webhook by adding /webhook to your Heroku app URL, also dont forget to enable the NLP (Natural Language Processing) that is given by Facebook.
7. Create your MongoDB database.

### MongoDB database installation
MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas. MongoDB is developed by MongoDB Inc. Dont forget to download MongoDB to your machine if you're not installed them [here](https://www.mongodb.com/try/download/community).
1. If you dont have any MongoDB account, register them [here](https://account.mongodb.com/account/register?signedOut=true)
2. In your main organization page, create a new project and name them whatever you want.
  ![image](https://user-images.githubusercontent.com/90015124/177465513-eaa0e2f6-5ff9-4d76-af6c-78161afa8694.png)
3. At your main page, create your cluster, Choose the shared version and name your cluster.
  ![image](https://user-images.githubusercontent.com/90015124/177465740-c1b6ff7d-6dd6-4f2c-bae6-758a779165ab.png)
4. Create your database user with username and password.
  ![image](https://user-images.githubusercontent.com/90015124/177465881-7624b27c-4296-4796-8afc-18a92d6086e2.png)
5. Set your network access so any IP can accesed your database.
  ![image](https://user-images.githubusercontent.com/90015124/177465976-47ad17f8-4bae-46e2-96ac-780394f3659e.png)
5. At your main database page, go to your cluster name and select collections. Then you can create your database and collection, for me, I use two collection, but it is up to you how you want to create your collection
  ![image](https://user-images.githubusercontent.com/90015124/177466189-2a1d7722-ec51-4ff2-b4c9-d588460b8263.png)
6. Go back to your main database page and choose connect. choose connect your application with native drivers and get the link.
  ![image](https://user-images.githubusercontent.com/90015124/177466380-999d5015-4acf-45fd-a167-49917b44556d.png)
  ![image](https://user-images.githubusercontent.com/90015124/177466418-5adbb3e5-f157-4756-92cd-eee277928d20.png)
7. Put all the variables needed to your env file and your database is ready to be used.

## Reference and documentation
- https://developers.facebook.com/docs/
- https://www.mongodb.com/docs/
- https://www.youtube.com/watch?v=x_0X3EHmIu4

## Note
In this app I used facebook webhook with NodeJS and MongoDB as database, I also created a version that not has any database [here]() so the data happens  synchronously with the REST Endpoint. Also I want to mention that testing is coming to next update soon, I made my testing using Jest. With this app you also can test my chatbot in [Facebook](https://www.facebook.com/agungmuliachatbot/?locale=en_US) or in [Heroku app](https://agungchatbot.herokuapp.com/) that I've already deployed. I finalized my Git and reinitialized them to look more clean, I want to use git flow, but my commits are a lot, so I choose to reinitialized them.



