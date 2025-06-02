## ⚙️ Setup Instructions

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/rifah07/ShopSphere__A-Complete-World-for-Shopping__Backend.git
cd ShopSphere__A-Complete-World-for-Shopping__Backend
```

### 🔹 2. Install Dependencies
```bash
npm install
```

### 🔹 3. Create Environment Variables
Create a `.env` file in the root:
[see the structure in `.example.env`]

### 🔹 4. Scripts

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon",
    "build": "tsc",
    "start": "node dist/server.js",
    "clean": "rm -rf dist"
},
```

### 🔹 5. Build and Run

**Development (with ts-node-dev):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```