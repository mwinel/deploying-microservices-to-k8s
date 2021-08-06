const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  // articles service
  axios.post("http://articles-clusterip-srv:3001/events", event).catch((err) => {
    console.log(err.message);
  });
  // comments service
  axios.post("http://comments-clusterip-srv:3002/events", event).catch((err) => {
    console.log(err.message);
  });
  // query service
  axios.post("http://query-clusterip-srv:3003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(3004, () => {
  console.log("Event-bus listening on 3004");
});
