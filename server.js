import express from "express";
import open from "open";

import { authorizeUrl, generateToken, getFotos } from "./auth.js";

const app = express();
const port = 3000;
let client;
let albums = [];

app.use(express.json());
// Set up passport and session handling.

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  client = await generateToken(code, client);
  if (client) {
    res.send("Token autorizado");
  }
});

app.get("/get-auth", async (req, res) => {
  const url = authorizeUrl;
  open(url);
  res.send("Requisição enviada");
});

app.post("/create-album", (req, res) => {
  let nome = req.body.nome;
  let year = req.body.year
  let month =req.body.month
  let day = req.body.day;
  let data = {
    "year": year,
    "month": month,
    "day": day
};
  let album = { nome, data };
  albums.push(album);

  res.send(album);
});

app.get("/get-all-albums", (req, res) => {
  res.send(albums);
});

app.delete("/delete-album/:nome", (req, res) => {
  const nome = req.query.nome;
  let index = albums.indexOf(nome);
  let deleted = albums.splice(index, 1);
  res.send(deleted);
});

app.get("/verificar-albums-a-serem-criados", async (req, res) => {
  let year = req.body.year;
  let month = req.body.month;
  let day = req.body.day;
  // Verificar albuns com datas do dia
  function filterNull(albums, year, month, day){
    let list = []
    albums.forEach(element => {
      if(element.data.year == year && element.data.month == month && element.data.day == day){
        list.push(element)
      }
    })
    return list
    }

  let albums_filter = filterNull(albums, year, month, day);
  
  if (albums_filter[0] == null){
    res.send('Sem albuns') 
  }else{
     //importar fotos do google fotos do dia e colocar nos albuns
    const result = await getFotos(client)
    res.send(result)
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});

