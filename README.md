# Yaya API Middleware

A secure middleware API that acts as a shield between your frontend applications and the Yaya Wallet API, handling authentication and request signing automatically.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 🛡️ Purpose

This API middleware serves as a security layer to protect your Yaya Wallet API credentials. Instead of calling the Yaya API directly from frontend code (which would expose your API key and secret), all requests are routed through this middleware which:

- Securely stores API credentials in environment variables
- Automatically generates required HMAC signatures for each request
- Adds proper authentication headers
- Acts as a proxy between your frontend and the Yaya API

## ✨ Features

- **Secure Authentication**: Automatically signs requests with keyed-HMAC signatures
- **Environment Protection**: Keeps API credentials secure on the server side
- **Header Management**: Handles all required authentication headers automatically
- **Easy Integration**: Provides simple endpoints that mirror the Yaya API
- **CORS Enabled**: Ready to be consumed by frontend applications
  ```CORS
      app.enableCors({
        origin: [
          'http://localhost:5173'
        ],
        credentials: false,
        methods: [ 'GET','POST' ]
        });
  ```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Yaya Wallet API credentials (API Key and Secret)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tevBoyz/yaya-api.git
cd yaya-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables. Create a `.env` file in the root directory:
```env
YAYA_API_KEY=your_api_key_here
YAYA_API_SECRET=your_api_secret_here
YAYA_BASE_URL=https://sandbox.yayawallet.com
```

4. Start the server:

For development with auto-restart:
```bash
npm run dev

# Server runs on http://localhost:3000

# At this point you can use the frontend repo to clone and start the dashboard to view results
# Dashboard repo: https://github.com/tevBoyz/yaya-frontend

# Alternatively, use Postman to test responses using the endpoints below
```

## 📖 API Endpoints

### Get Server Time
```http
GET http://localhost:3000/time
```

### Get User Transactions
```http
GET http://localhost:3000/transactions/find-by-user

# With pagination:
GET http://localhost:3000/transactions/find-by-user?p=1
# Returns the first page of transactions
```

### Search Transactions
```http
POST http://localhost:3000/transactions/search
Content-Type: application/json

{
  "query": "Your_search_parameter"
}
```

## 🔐 How It Works

This middleware automatically handles the Yaya API authentication requirements:

1. **Timestamp**: Generates a current timestamp for each request (no authentication headers required for the time endpoint)
2. **Signature**: Creates an HMAC signature using your API secret
   
       ```signature formula
         const timestamp= Date.now();
         const method = 'GET";
         const endpoint = 'api/en/transactions/function'
         const body = '';
         const pre = timestamp + method + endpoint + body;
         const signature = crypto.create("sha256", api_secret).update(pre).digest('base64);

        # for more info refer to the manual provided by YAYA: https://docs.yayawallet.com/hc/main/articles/1699693758-api-authentication
       ```
3. **Headers**: Adds the required headers to each request:
   - `YAYA_API_KEY`: Your Yaya API key
   - `YAYA_API_TIMESTAMP`: The current timestamp
   - `YAYA_API_SIGN`: The generated HMAC signature

## 🛠️ Built With

- [NestJS](https://nestjs.com/) - API framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Crypto](https://nodejs.org/api/crypto.html) - Node.js built-in crypto module for HMAC generation
- [Dotenv](https://github.com/motdotla/dotenv) - Environment variable management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/tevBoyz/yaya-api/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## ⚠️ Important Security Notes

- Never commit your `.env` file or expose your API credentials
- Ensure your server environment is secure
- Use HTTPS in production environments
- Regularly rotate your API keys for enhanced security

## 📧 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Disclaimer**: This project is not officially affiliated with Yaya Wallet. It is an independent middleware solution designed to enhance security when working with the Yaya Wallet API.
