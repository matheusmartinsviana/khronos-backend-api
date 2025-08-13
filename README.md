# Khronos Backend API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green) ![Express](https://img.shields.io/badge/Express.js-^4.x-blue) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

API RESTful para processar vendas e centralizar dados dessas vendas fazendo o uso de arquitetura em camadas e boas práticas de desenvolvimento com Node.js.

---

## Docker Hub Image

[Docker Hub – khronos-api](https://hub.docker.com/repository/docker/matheusmartinsviana/khronos-api/image-management)

## 📁 Estrutura do Projeto

```
khronos-backend-api/
├── tests/
├── src/
│ ├── api/ # É onde começa, userRoute chama um método da classe UserApi
│ │ ├── UserApi.js
│ ├── controllers/ # Recebe as informações e chama um método do service
│ │ ├── UserController.js
│ ├── services/ # É responsável por processar os dados e enviar para o model
│ │ ├── UserServices.js
│ ├── models/ # É onde ocorre a comunicação com o banco de dados
│ │ ├── UserModel.js
│ ├── routes/ 
│ │ ├── UserRoute.js
│ ├── middlewares/
│ │ ├── auth.js
│ ├── errors/
│ │ ├── AppError.js
│ ├── repositories/ # Operações mais complexas com o banco de dados
│ ├── utils/ # Funções de bibliotecas externas
│ ├── config/ 
│ │ └── database.js
│ └── server.js
├── package.json
└── README.md
```
