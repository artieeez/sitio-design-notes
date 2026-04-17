const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();

// server.js
//
// Use this sample code to handle webhook events in your expressjs server.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install jsonwebtoken
//   npm install express
//
// 3) Run the server on http://localhost:3000
//   node server.js

// consider loading your public key from a file or an environment variable
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwhN8f0f6Kj3Ar+56RHHE
QwE9rYfVZaDl9rHVK+rvyyjj/VL4/HiTqRLZgpX3vF8S6oWjrfRqkgbUum8ts+0C
VPowWjy/C3C6zj0rFsaLtZk2BmIiihf14sgqIO0agiZrR/yqsxpSStaaNnHvuf6y
MzjPyd/J2fLM9y4x+2pA7IIofw+6a/VzravmMlnwVjCaxqRlEHKcdhNzB4dTuyJO
w33Zu8Z4hFkVxbNIw91j5VQMobYyqjExok3yTO43rs/CFMV9S8Qqqhb97a16VJJY
VzM7hpS+on4n9Maw4ugK8zZEYfsgWvDG3MBu6Y1OU3vwkOQtV/cpCL2nucmRVDmQ
bQIDAQAB
-----END PUBLIC KEY-----`;

app.post('/webhook', express.text(), (request, response) => {
  let event;
  let eventData;

  try {
    const rawPayload = jwt.verify(request.body, PUBLIC_KEY);
    event = JSON.parse(rawPayload.data);
    eventData = JSON.parse(event.data);
  } catch (err) {
    console.error(err);
    response.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  switch (event.eventType) {
    case "OrderPaid":
      console.log(`OrderPaid event received with data:`, eventData);
      console.log(`App instance ID:`, event.instanceId);
      //
      // handle your event here
      //
      break;
    default:
      console.log(`Received unknown event type: ${event.eventType}`);
      break;
  }

  response.status(200).send();

});

app.listen(3000, () => console.log("Server started on port 3000"));
