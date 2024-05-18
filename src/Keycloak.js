// src/Components/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/', // 确保 URL 正确指向你的 Keycloak 服务器的 auth 端点
  realm: 'quick-start',
  clientId: 'my-quick-start-app',
});

export default keycloak;
