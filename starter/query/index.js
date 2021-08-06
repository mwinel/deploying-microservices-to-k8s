const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const articles = {};

const handleEvent = (type, data) => {
  if (type === "ArticleCreated") {
    const { id, title, content } = data;

    articles[id] = { id, title, content, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, articleId, status } = data;

    const article = articles[articleId];
    article.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, articleId, status } = data;

    const article = articles[articleId];
    const comment = article.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/articles", (req, res) => {
  res.send(articles);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(3003, async () => {
  console.log("Query service listening on 3003");
  try {
    const res = await axios.get("http://localhost:3004/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
