import express from "express";
import sanitizeHtml from "sanitize-html";
// @ts-ignore
import middleware from "../middleware";

const app = express();
app.use((_, res, next) => {
  res.locals.sanitizeHtml = sanitizeHtml;
  next();
});

middleware(app);

export default app;
