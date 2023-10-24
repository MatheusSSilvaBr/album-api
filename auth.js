import { readFile } from "fs/promises";
import { OAuth2Client } from "google-auth-library";
import google from "googleapis";
const client_credential = JSON.parse(
  await readFile("./client_secret.json", "utf-8")
);

// Carregue as credenciais do arquivo JSON
const credentials = client_credential["web"];

// Crie um objeto JWT com as credenciais
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

export { authorizeUrl, oauth2Client };
