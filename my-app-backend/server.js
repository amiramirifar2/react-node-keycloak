const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Session
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Keycloak
const keycloak = new Keycloak({ store: memoryStore }, {
  "realm": "myRealm",
  "auth-server-url": "http://localhost:8080",
  "ssl-required": "external",
  "resource": "myClient",
  "public-client": true,
  "confidential-port": 0
});

app.use(keycloak.middleware());

// Routes
app.get('/public', (req, res) => {
  res.json({ message: 'این مسیر عمومی است' });
});

app.get('/protected', keycloak.protect(), (req, res) => {
  res.json({ message: 'این مسیر محافظت شده است', user: req.kauth.grant.access_token.content });
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
