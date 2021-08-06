const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByArticleId = {};

app.get("/articles/:id/comments", (req, res) => {
  res.send(commentsByArticleId[req.params.id] || []);
});

app.post("/articles/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByArticleId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByArticleId[req.params.id] = comments;

  await axios.post("http://event-bus-clusterip-srv:3004/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      articleId: req.params.id,
      status: "approved",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { articleId, id, status, content } = data;
    const comments = commentsByArticleId[articleId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://event-bus-clusterip-srv:3004/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        articleId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(3002, () => {
  console.log("Comments service listening on 3002");
});
