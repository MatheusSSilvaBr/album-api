## Album-api

#### Grupo 3 : Matheus, Marlon, Franciely, Laurieny e Joice

### Escopo do projeto

1. Criação do álbum (nome, data referencia (data em que as fotos foram tiradas))
2. Listar os álbuns criados 
3. Deletar um álbum (pelo nome), se ainda não tiver acontecido
4. Rota verificarAlbunsASeremCriados (data de referencia como parametro): 
	a. Verificar se tem álbum a ser criado para o data referencia informada. Se não tiver, ignora.
	b. Se tiver,
		I. Listar todos os álbuns definidos para o dia corrente
		II. Para cada álbum, listar todas as fotos contidas no Google Photos com a data referencia inserida no álbum (chamada a API do Google)
		III. Criar o álbum no Google Photos usando o nome informado e as fotos selecionadas (chamada a API do Google)

- API do Google Photos
1. Logar (Criar "workspace", criar projeto, pegar CLIENT_ID, APP_KEY)
2. Criar o álbum com o nome informado
3. Selecionar as fotos com a mesma data de referencia para este álbum

### Como rodar o projeto

- Crie uma conta no site da google developers
- Escolha a Api de fotos do google
- Crie um projeto , suas credenciais e deixe seu projeto com a autorização de teste
- Baixe as credenciais em formato .json, altere o nome do arquivo para client_secret.json e adicione ao projeto

- Rode no terminal: npm install

- Rode no terminal: node server.js

- Abra o postman ou insomnia para fazer as rotas
    - Observação: Para criar um álbum, adicione uma data em que existam fotos na sua conta 