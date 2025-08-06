# CineScope React Native App

Este diretório contém o aplicativo móvel React Native para o CineScope.

## Instruções de Configuração

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
npx expo start
```

3. Execute no simulador/dispositivo:
```bash
npm run ios
# ou
npm run android
# ou
npm run web
```

## Estrutura do Projeto

- `assets/` - Imagens, fontes e outros recursos estáticos
- `components/` - Componentes UI reutilizáveis
- `navigation/` - Configuração de navegação usando React Navigation
- `screens/` - Telas/páginas do aplicativo
- `services/` - Serviços de API e integrações externas (TMDb)
- `store/` - Gerenciamento de estado (Redux ou Context)
- `utils/` - Funções utilitárias e helpers

## Principais Recursos

- 🔐 Autenticação de usuário
- 🎞️ Lista pessoal de filmes
- 📝 Adição de novas entradas com:
  - Título
  - Avaliação (0-10)
  - Comentário pessoal
  - Data de visualização
- 🎥 Integração com TMDb para metadados de filmes
- 📅 Modo de visualização em timeline
