import express from "express";
import open from "open";

import { authorizeUrl, generateToken, getFotos, filterNull, createAlbum, filesUpload, downloadImage, getNewMedia} from "./auth.js";

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
  let data = {
    "year": year,
    "month": month,
    "day": day
};
  // Verificar albuns com datas do dia
  let albums_filter = filterNull(albums, year, month, day);
  
  if (albums_filter[0] == null){
    res.send('Sem albuns') 
  }else{
     //importar fotos do google fotos do dia e colocar nos albuns
    const result = await getFotos(client, year, month, day)
    let fotos = result.mediaItems

    //baixar todas as fotos
    fotos.forEach(async function(element){
      await downloadImage(element)
    })

    let newMediaItems = await getNewMedia(client, fotos)

    //colocar as fotos dentro dos albuns criados
    const albumsSelecionados  = albums.forEach(async function(item) {
      if(JSON.stringify(item.data) == JSON.stringify(data)){
        const album = await createAlbum(client, item.nome)
        
         //faz upload da foto no album
          const mediaAdd = await filesUpload(client, album.id, newMediaItems) 
      }
    });

    
    res.send(albums_filter)
  }
});

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});

