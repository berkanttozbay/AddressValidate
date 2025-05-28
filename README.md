🧠 MCP + Address Validation API Integration
This project is a lightweight conversational service that uses MCP (Modular Conversational Platform) combined with Cloudmersive's Address Parsing and Validation API to interpret and verify unstructured address data in real time.

🚀 Features
✅ Parse unstructured address strings

✅ Validate and normalize addresses using Cloudmersive API

✅ Return structured output: street, city, postal code, country, etc.

✅ Designed for easy integration into chat-based or form-based systems

✅ Built with TypeScript and Express.js

✅ Supports MCP agents for natural conversation flow

📦 Technologies Used
Node.js & TypeScript

Express.js

MCP Framework

Cloudmersive Address Validation API

dotenv for environment config

CORS + JSON body parsing

📁 Project Structure
bash
Kopyala
Düzenle
├── app.py             # (Optional) Python variant (if used separately)
├── app.ts             # Contains API logic (address parsing)
├── server.ts          # Express server and MCP agent integration
├── .env               # Store your Cloudmersive API key
├── package.json       # Project dependencies and scripts
├── README.md          # Project documentation
🔧 Setup Instructions
Clone the repo:

bash
Kopyala
Düzenle
git clone https://github.com/your-username/mcp-address-validator.git
cd mcp-address-validator
Install dependencies:

bash
Kopyala
Düzenle
npm install
Set your Cloudmersive API key:

Create a .env file in the root folder and add:

env
Kopyala
Düzenle
API_KEY=your_cloudmersive_api_key
PORT=3000
You can get a free API key from https://www.cloudmersive.com/

Run the server:

bash
Kopyala
Düzenle
npm run dev
API Endpoints:

GET /health – Check server and agent status

POST /chat – Send a message to MCP agent

POST /temperature – (Optional) Weather tool example

