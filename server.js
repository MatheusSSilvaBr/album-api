import { authorizeUrl } from "./auth.js";
import express from "express";

const app = express();
const port = 3000;

app.get("/get-auth", (req, res) => {
  const url = authorizeUrl;
  res.redirect(202, url);
});

app.get("/auth/google/callback", (req, res) => {});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
