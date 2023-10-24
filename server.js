import { authorizeUrl, generateToken } from "./auth.js";
import express from "express";
import open from "open";

const app = express();
const port = 3000;
let client;

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  client = await generateToken(code, client);
  if (client) {
    res.send("Token autenticado");
  }
});

app.get("/get-auth", async (req, res) => {
  const url = authorizeUrl;
  // colocar try catch
  open(url);
  res.send("Requisição enviada");
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
