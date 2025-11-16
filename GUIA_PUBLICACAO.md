# 📦 Guia de Publicação - n8n Community Node

Este guia explica como publicar o node na comunidade n8n e como usá-lo tanto localmente quanto na nuvem.

## 🚀 Opções de Uso

### 1. Desenvolvimento Local (npm link)

Para desenvolvimento e testes locais:

```bash
# No diretório do projeto
npm install
npm run build
npm link

# No diretório do seu n8n local
cd /caminho/para/seu/n8n
npm link n8n-nodes-hubdb
```

**⚠️ IMPORTANTE**: O `npm link` só funciona para n8n instalado localmente. **NÃO funciona para n8n na nuvem**.

### 2. Uso na Nuvem (Publicação no npm)

Para usar o node no n8n na nuvem, você precisa publicar no npm:

#### Passo 1: Preparar o Projeto

1. **Atualizar package.json** com suas informações:
```json
{
  "name": "n8n-nodes-hubdb",
  "version": "1.0.0",
  "description": "n8n node for HubSpot HubDB API v3 operations",
  "author": {
    "name": "Seu Nome",
    "email": "seu@email.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/seu-usuario/n8n-nodes-hubdb"
  }
}
```

2. **Criar conta no npm** (se ainda não tiver):
   - Acesse: https://www.npmjs.com/signup
   - Ou use: `npm adduser`

#### Passo 2: Build e Teste

```bash
# Instalar dependências
npm install

# Build do projeto
npm run build

# Verificar se compilou corretamente
ls dist/
```

#### Passo 3: Publicar no npm

```bash
# Login no npm
npm login

# Publicar (primeira vez)
npm publish --access public

# Para atualizações futuras, apenas incremente a versão
npm version patch  # ou minor, ou major
npm publish
```

#### Passo 4: Instalar no n8n (Cloud ou Self-hosted)

No seu n8n (cloud ou self-hosted), você pode instalar de duas formas:

**Opção A: Via Interface do n8n (Recomendado)**
1. Vá em **Settings** → **Community Nodes**
2. Clique em **Install a community node**
3. Digite: `n8n-nodes-hubdb`
4. Clique em **Install**

**Opção B: Via Variável de Ambiente (Self-hosted)**
```bash
# Adicione ao seu .env ou docker-compose.yml
N8N_COMMUNITY_PACKAGES=n8n-nodes-hubdb

# Reinicie o n8n
```

## 📋 Submissão para Comunidade Oficial n8n

Para que o node apareça na lista oficial de community nodes do n8n:

### Requisitos

1. ✅ **Publicado no npm** com nome `n8n-nodes-*`
2. ✅ **README.md** completo e claro
3. ✅ **Código funcional** e testado
4. ✅ **Licença MIT** (ou compatível)
5. ✅ **Sem dependências problemáticas**

### Processo de Submissão

1. **Criar Pull Request no repositório oficial**:
   - Repositório: https://github.com/n8n-io/n8n-docs
   - Adicione seu node na lista de community nodes
   - Documentação: https://docs.n8n.io/integrations/community-nodes/

2. **Ou submeter via formulário**:
   - Acesse: https://github.com/n8n-io/n8n/issues/new?template=community-node-submission.md
   - Preencha todas as informações solicitadas

### Checklist de Submissão

- [ ] Node publicado no npm
- [ ] README.md com exemplos de uso
- [ ] Todas as operações funcionando
- [ ] Testado em n8n local
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Build bem-sucedido (`npm run build`)
- [ ] Licença MIT no package.json
- [ ] Ícone do node (opcional, mas recomendado)

## 🔧 Estrutura Final do Projeto

```
n8n-nodes-hubdb/
├── dist/                    # Arquivos compilados (gerado)
├── credentials/
│   └── HubDbApi.credentials.ts
├── nodes/
│   └── HubDb/
│       ├── HubDb.node.ts
│       ├── HubDb.node.json
│       ├── operations/
│       └── descriptions/
├── package.json
├── tsconfig.json
├── gulpfile.js
├── README.md
└── .gitignore
```

## 📝 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Watch mode para desenvolvimento
npm run build        # Build do projeto
npm run lint         # Verificar erros de lint
npm run lintfix      # Corrigir erros de lint automaticamente

# Publicação
npm version patch    # Incrementar versão (1.0.0 → 1.0.1)
npm version minor    # Incrementar versão (1.0.0 → 1.1.0)
npm version major    # Incrementar versão (1.0.0 → 2.0.0)
npm publish          # Publicar no npm
```

## ⚠️ Notas Importantes

1. **n8n Cloud**: Você precisa publicar no npm para usar. O `npm link` não funciona.

2. **Self-hosted**: Você pode usar `npm link` para desenvolvimento, mas para produção é melhor instalar via npm.

3. **Versões**: Sempre teste bem antes de publicar uma nova versão. Use `npm version` para gerenciar versões.

4. **Nome do pacote**: O nome deve seguir o padrão `n8n-nodes-*` para ser reconhecido como community node.

## 🆘 Troubleshooting

### Erro: "Cannot find module 'n8n-nodes-hubdb'"
- Certifique-se de que publicou no npm
- Verifique se o nome do pacote está correto
- Tente reinstalar: `npm uninstall n8n-nodes-hubdb && npm install n8n-nodes-hubdb`

### Erro: "Node not found"
- Verifique se o build foi bem-sucedido
- Confirme que os arquivos estão em `dist/`
- Reinicie o n8n após instalar

### Build falha
- Execute `npm install` novamente
- Verifique se todas as dependências estão instaladas
- Execute `npm run lint` para ver erros

## 📚 Recursos Adicionais

- [Documentação n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Guia de Criação de Nodes](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

