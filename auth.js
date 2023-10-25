import { readFile } from "fs/promises";
import { google } from "googleapis";
import  https  from 'https'
import path, { resolve } from 'path'
import fs from 'fs'


const client_credential = JSON.parse(
  await readFile("./client_secret.json", "utf-8")
);

// Carregue as credenciais do arquivo JSON
const credentials = client_credential["web"];

// Crie um objeto JWT com as credengciais
const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris
);

// Gere o URL de autorização
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: "https://www.googleapis.com/auth/photoslibrary",
});

async function generateToken(code, client) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  client = oauth2Client;
  if (tokens) {
    return oauth2Client;
  }
}

async function getFotos(client, year, month, day){
  const searchResponse =
          await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:search', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + client.credentials.access_token,
            },
            body: JSON.stringify({
              "filters": {
                      "dateFilter": {
                        "dates": [
                          {
                            "year": year,
                            "month": month,
                            "day": day
                          }
                          ]
                        }
                      }
          })
          });

    const result = await checkStatus(searchResponse);
    return result
    
}

async function createAlbum(client, name){

  const createAlbumWithName =
          await fetch('https://photoslibrary.googleapis.com/v1/albums', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + client.credentials.access_token,
            },
            body: JSON.stringify({             
                "album": {
                  "title": name
                }
          })
          });

    const albumCreated = await createAlbumWithName.json();
    return albumCreated
}

async function checkStatus(response){
  if (!response.ok){
    let message = "";
    try{
        message = await response.json();
    } catch( err ){
    }
    throw new StatusError(response.status, response.statusText, message);
  }

  return await response.json();
}

function filterNull(albums, year, month, day){
  let list = []
  albums.forEach(element => {
    if(element.data.year == year && element.data.month == month && element.data.day == day){
      list.push(element)
    }
  })
  return list
  }

async function getUploadToken(client, fotoName){
  const photo = fs.readFileSync(`./images/${fotoName}`, {'flag' : 'r'
});
  const uploadFotos = await fetch(`https://photoslibrary.googleapis.com/v1/uploads`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Authorization': 'Bearer ' + client.credentials.access_token,
      'X-Goog-Upload-Content-Type': 'image/jpg',
      'X-Goog-Upload-Protocol': 'raw'
    },
    body: photo
  });
  
  const status = await uploadFotos.text()
  return status
}


async function filesUpload(client,id, mediaItens){
  const uploadFile =
  await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + client.credentials.access_token
    },
    body: JSON.stringify({
        "albumId": id,
        "newMediaItems": mediaItens
      })
})
  const status = await uploadFile.json()
  return status
}



async function downloadImage(foto){
  const urlDaImagem = foto.baseUrl
  const pastaDestino = './images'
  const nomeDoArquivoLocal = foto.filename

  if(!fs.existsSync(pastaDestino)){
    fs.mkdirSync(pastaDestino, {recursive: true})
  }

  const pathArquivo = path.join(pastaDestino, nomeDoArquivoLocal);

  https.get(urlDaImagem, response => {
    if(response.statusCode !== 200){
      return
    }
    const arquivoLocal = fs.createWriteStream(pathArquivo);
    response.pipe(arquivoLocal);
    
    arquivoLocal.on('finish', ()=> {
      arquivoLocal.close(() => {
      })
    })
  })
}

async function getNewMedia(client, fotos){
  let list = []
  let token = ""
  await fotos.forEach(async function(element){
    token = await getUploadToken(client, element.filename)
    let retorno = {
      "description": "None",
      "simpleMediaItem": {
        "fileName": element.filename,
        "uploadToken": token
        }
      }
      list.push(retorno)
  })

  return list
}

export { authorizeUrl, oauth2Client, generateToken, getFotos, filterNull, createAlbum, filesUpload, downloadImage, getNewMedia};
