# Configuração do Projeto CineScope

Este documento registra os passos de configuração e instalação do projeto CineScope.

## Etapa 1: Estrutura inicial do projeto

1. Criamos a estrutura de diretórios básica:
   - `app/` - Aplicativo React Native
   - `backend/` - API Node.js
   - `docs/` - Documentação do projeto
   - `.github/workflows/` - Configurações de CI/CD

2. Configuramos o Docker Compose para desenvolvimento local:
   - Serviço backend com Node.js
   - Banco de dados PostgreSQL

3. Criamos os arquivos README iniciais para o app e o backend

## Etapa 2: Configuração do React Native com Expo

1. Instalamos o Expo CLI globalmente:
```bash
npm install -g expo-cli
```

2. Inicializamos o projeto Expo na pasta app/:
   - Criamos um projeto temporário com `npx create-expo-app`
   - Transferimos os arquivos para a pasta `app/`
   - Personalizamos o README.md com as informações específicas do CineScope

3. Estrutura base do aplicativo React Native:
   - Configuração básica do Expo
   - Estrutura de diretórios recomendada

## Próximos Passos

- Configurar o backend Node.js/Express
- Implementar a autenticação de usuários
- Criar os modelos de dados do PostgreSQL
- Desenvolver as principais telas do aplicativo
- Implementar a integração com a API do TMDb
