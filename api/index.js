const Ably = require('ably');
const fs = require('fs');
const path = require('path');

const ably = new Ably.Realtime('ynrGug.SXDJOg:aoStJmyUcLlpwgEzYsJt8CFDsTBCq-yMjqNn6_DkgvM');
const channel = ably.channels.get('chat-demo');

module.exports = (req, res) => {
  if (req.method === 'GET' && req.query.endpoint === 'auth') {
    ably.auth.createTokenRequest((err, tokenRequest) => {
      if (err) {
        res.status(500).send('Erro ao criar token de autenticação');
      } else {
        res.json(tokenRequest);
      }
    });
  } else if (req.method === 'GET' && req.query.endpoint === 'users') {
    fs.readFile(path.join(__dirname, '../users.json'), (err, data) => {
      if (err) {
        res.status(500).send('Erro ao ler lista de usuários');
      } else {
        res.json(JSON.parse(data));
      }
    });
  } else if (req.method === 'POST' && req.query.endpoint === 'update-location') {
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
  } else {
    res.status(404).send('Endpoint não encontrado');
  }
};
