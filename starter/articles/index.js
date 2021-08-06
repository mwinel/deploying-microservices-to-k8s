const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const articles = {};

app.get("/articles", (req, res) => {
  res.send(articles);
});

app.post("/articles", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title, content } = req.body;

  articles[id] = {
    id,
    title,
    content,
  };

  await axios.post("http://localhost:3004/events", {
    type: "ArticleCreated",
    data: {
      id,
      title,
      content,
    },
  });

  res.status(201).send(articles[id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(3001, () => {
  console.log("Articles service listening on 3001");
});
