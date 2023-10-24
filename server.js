import { authorizeUrl, oauth2Client } from "./auth.js";
import express from "express";
import open from "open";

const app = express();
const port = 3000;
let client;

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  if (tokens) {
    res.send("Token autenticado");
    client = oauth2Client;
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
