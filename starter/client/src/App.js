import React from "react";
import ArticleCreate from "./ArticleCreate";
import ArticlesList from "./ArticlesList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Article</h1>
      <ArticleCreate />
      <hr />
      <h1>Articles</h1>
      <ArticlesList />
    </div>
  );
};

export default App;
