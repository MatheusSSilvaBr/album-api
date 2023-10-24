import { readFile } from "fs/promises";
import { OAuth2Client } from "google-auth-library";
import google from "googleapis";
const client_credential = JSON.parse(
  await readFile("./client_secret.json", "utf-8")
);

// Carregue as credenciais do arquivo JSON
const credentials = client_credential["web"];

// Crie um objeto JWT com as credenciais
const oauth2Client = new google.auth.OAuth2Client(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris
);

// Gere o URL de autorização
const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: "https://www.googleapis.com/auth/photoslibrary",
});

// Após o usuário autorizar sua aplicação, você pode trocar o código de autorização pelo token de acesso
function getCode() {
  const code = "CÓDIGO_DE_AUTORIZAÇÃO";
  return this.code;
}

function getToken() {
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error("Erro ao obter o token de acesso:", err);
      return;
    }

    oauth2Client.setCredentials(token);

    // Agora você pode usar oauth2Client para fazer chamadas à API do Google Fotos.
  });
}

export { authorizeUrl };
