const Ably = require('ably');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const ably = new Ably.Realtime('ynrGug.SXDJOg:aoStJmyUcLlpwgEzYsJt8CFDsTBCq-yMjqNn6_DkgvM');
const channel = ably.channels.get('chat-demo');

// Endpoint para autenticação
app.get('/api/auth', (req, res) => {
  ably.auth.createTokenRequest((err, tokenRequest) => {
    if (err) {
      res.status(500).send('Erro ao criar token de autenticação');
    } else {
      res.json(tokenRequest);
    }
  });
});

// Endpoint para obter a lista de usuários
app.get('/api/users', (req, res) => {
  fs.readFile(path.join(__dirname, '../users.json'), (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler lista de usuários');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Endpoint para atualizar a localização do usuário
app.post('/api/update-location', (req, res) => {
  const { username, lat, lng } = req.body;
  fs.readFile(path.join(__dirname, '../users.json'), (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler lista de usuários');
    } else {
      const users = JSON.parse(data);
      const userIndex = users.findIndex(user => user.username === username);

      if (userIndex !== -1) {
        users[userIndex].lat = lat;
        users[userIndex].lng = lng;
      } else {
        users.push({ username, lat, lng });
      }

      fs.writeFile(path.join(__dirname, '../users.json'), JSON.stringify(users), (err) => {
        if (err) {
          res.status(500).send('Erro ao atualizar lista de usuários');
        } else {
          res.send('Localização atualizada com sucesso');
        }
      });
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
