# 🚀 Real-time Chat Application

##Watch the video preview

[![Watch the video](https://img.youtube.com/vi/KWu67XO76wY/hqdefault.jpg)](https://youtu.be/KWu67XO76wY)



## Some Features
- 🔐 Authentication & Authorization with JWT and Protected Routes
- ⚡Real-time typing indicators with auto-scroll
- 📜 Infinite scroll with chunked message loading
- 🚀 Real-time bidirectional communication with Socket.io
- 📱 Fully responsive design optimized for all devices
- ⚡Live messaging with real-time notifications and message alerts
- 💾 Persistent chat history with MongoDB
- ⌛ Message timestamps
- 👥 Group chat functionality
- 🎭 User avatars with image upload capability
- 🔄 Global state management with Redux Toolkit
- ⭐ Optimized performance with pagination and lazy loading
- 🐛 Comprehensive error handling (client & server)
- ⏳ And much more!

## Tech Stack
![My Skills](https://skillicons.dev/icons?i=react,tailwind,mongodb,nodejs,express,redux)

- Frontend: React
- Backend Framework: Expressjs
- Database: MongoDB
- State Management: Redux Toolkit

## Environment Variables

### Backend env file
- Create a .env file in the backend folder and add the following .env variables 

`PORT`: Port on which the backend would start.

`MONGODB_URI`: MongoDB URI to connect to the database.

`JWT_SECRET`: JWT Key required for hashing confidential information and maitaining privacy of users

`CLOUDINARY_CLOUD_NAME`: Credentials for cloudinary for file uploads

`CLOUDINARY_API_KEY`: Credentials for cloudinary for file uploads

`CLOUDINARY_API_SECRET`: Credentials for cloudinary for file uploads

`CLIENT_URL`: URL at which the frontend application is hosted

### Frontend env file
- Create a .env file in the frontend folder and add the following .env variables

`VITE_SERVER`: Server URL for APIs


## Installation and Running the Application

To clone and run this application, you'll need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en) (which comes with [npm](https://www.npmjs.com/)) installed on your computer 

### Installation
1. Clone this repository
```bash
git clone https://github.com/krishnathakkar29/Chat-Application.git
```

2. Install dependencies for backend
```bash
cd frontend
npm install
```

3. Install dependencies for backend
```bash
cd backend
npm install
```

### Running the application
1. Start the backend server
```
cd backend
npm run dev
```

2. Start the frontend application
```
cd frontend
npm run dev
```


