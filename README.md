# n8n-nodes-hubdb

n8n community node for HubSpot HubDB API v3 operations.

## Features

This node provides comprehensive access to HubSpot HubDB API v3, including:

- **Table Operations**: Create, read, update, delete, clone, publish, unpublish, and reset draft tables
- **Row Operations**: Full CRUD operations plus batch operations (create, update, read, delete, clone, replace)
- **Draft Operations**: Manage draft versions of tables and rows
- **Advanced Features**: 
  - Pagination support
  - Query filtering
  - Column name mapping
  - Batch operations

## Installation

### For n8n Cloud or Self-hosted (Production)

1. **Via n8n Interface** (Recommended):
   - Go to **Settings** → **Community Nodes**
   - Click **Install a community node**
   - Enter: `n8n-nodes-hubdb`
   - Click **Install**

2. **Via npm** (Self-hosted only):
```bash
npm install n8n-nodes-hubdb
```

### For Local Development

```bash
# In this project directory
npm install
npm run build
npm link

# In your local n8n directory
cd /path/to/n8n
npm link n8n-nodes-hubdb
```

**⚠️ Note**: `npm link` only works for local n8n installations. For n8n Cloud, you must publish to npm first.

## Credentials

The node requires HubSpot API credentials. You can use either:
- **API Key**: Your HubSpot Private App API Key
- **OAuth2**: OAuth2 Access Token

## Resources and Operations

### Table
- Get All
- Get
- Create
- Update
- Delete
- Clone
- Publish
- Unpublish
- Reset Draft

### Row
- Get All
- Get
- Create
- Update
- Delete
- Batch Create
- Batch Update
- Batch Read
- Batch Delete
- Batch Clone
- Batch Replace

### Draft Table
- Get
- Update

### Draft Row
- Get
- Update
- Batch Create
- Batch Read
- Batch Update
- Batch Delete
- Batch Clone
- Batch Replace

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
```

## License

MIT

