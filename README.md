# Khronos Backend API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

**API RESTful profissional para gestão de vendas e centralização de dados**

*Projeto final (TCC) desenvolvido para estudo de caso real na Empresa Khronos*

[Funcionalidades](#-funcionalidades) • [Início Rápido](#-início-rápido) • [Documentação da API](#-documentação-da-api) • [Arquitetura](#-arquitetura)

</div>

## 🚀 Visão Geral

A Khronos Backend API é uma API REST Node.js pronta para produção, projetada para processar transações de vendas e centralizar dados empresariais usando arquitetura em camadas e melhores práticas da indústria. Construída como uma solução real para as necessidades de negócio da Empresa Khronos.

### ✨ Principais Destaques

- **🏗️ Arquitetura em Camadas** - Separação clara de responsabilidades com camadas API → Controller → Service → Model
- **🔒 Segurança em Primeiro Lugar** - Autenticação JWT, limitação de taxa, validação de entrada e proteção contra injeção SQL  
- **📸 Gestão de Imagens** - Integração com Cloudinary para upload e transformações de imagens de produtos
- **⚡ Performance** - Consultas de banco otimizadas, paginação e estratégias de cache
- **🐳 Containerizado** - Pronto para Docker para fácil deploy e escalabilidade
- **🧪 Testes** - Cobertura de testes abrangente para confiabilidade

## 🛠️ Stack Tecnológica

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Banco de Dados:** MySQL 8.0+
- **Autenticação:** JWT (JSON Web Tokens)
- **Armazenamento de Arquivos:** Cloudinary
- **Validação:** Middleware customizado com verificações abrangentes
- **Limitação de Taxa:** Express Rate Limit
- **Processamento de Imagens:** Multer + transformações Cloudinary
- **Testes:** Jest
- **Containerização:** Docker & Docker Compose

## 🎯 Funcionalidades

### 👥 Gestão de Usuários
- **Autenticação multi-role** (Admin, Visualizador, Vendedor)
- **Registro seguro de usuários** com validação de email
- **Autenticação baseada em JWT** com refresh tokens
- **Funcionalidade de reset de senha**
- **Gestão de perfil de usuário** com permissões baseadas em role

### 🛍️ Gestão de Produtos
- **Operações CRUD completas** para produtos
- **Upload e gestão de imagens** via Cloudinary
- **Transformações de imagens** (thumbnails, diferentes tamanhos)
- **Categorização de produtos** e atribuição de ambiente
- **Operações em lote** para gestão eficiente de dados
- **Busca avançada e filtragem**

### 🏢 Entidades de Negócio
- **Categorias** - Sistema de classificação de produtos
- **Ambientes** - Gestão de ambientes de venda
- **Clientes** - Gestão de relacionamento com clientes
- **Serviços** - Gestão de catálogo de serviços

### 🔐 Funcionalidades de Segurança
- **Limitação de taxa** para prevenir abuso
- **Validação e sanitização** de entrada
- **Proteção contra injeção SQL**
- **Configuração CORS**
- **Helmet.js** para cabeçalhos de segurança
- **Hash de senhas** com Bcrypt

## Docker Hub Image

[Docker Hub – khronos-api](https://hub.docker.com/repository/docker/matheusmartinsviana/khronos-api/image-management)