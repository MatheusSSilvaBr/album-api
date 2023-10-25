import { readFile } from "fs/promises";
import google from "googleapis";
const client_credential = JSON.parse(
  await readFile("./client_secret.json", "utf-8")
);
const fotos = google;

// Carregue as credenciais do arquivo JSON
const credentials = client_credential["web"];

// Crie um objeto JWT com as credengciais
const oauth2Client = new google.Auth.OAuth2Client(
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

async function getFotos(client){
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
                            "year": 2023,
                            "month": 10,
                            "day": 23
                          }
                          ]
                        }
                      }
          })
          });

    const result = await checkStatus(searchResponse);
    return result
    
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

export { authorizeUrl, oauth2Client, generateToken, getFotos};
