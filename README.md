# NoteMap - Back End

## Overview
The back-end server for NoteMap handles data storage, API routing, and session management. It is built using Express and connects to a MongoDB database, providing a robust and secure environment for the application’s data.

## Key Features
- **User Authentication & Session Management:**
  - Validates sessions to ensure secure access.
  - Manages user state and session expiration.

- **Folder Management:**
  - **POST** request creates a new folder.
  - **PUT** request updates folder information.
  - **DELETE** request removes a folder and all associated notes.

- **Note Management:**
  - **POST** request creates a new note.
  - **PUT** request updates existing note content.
  - **DELETE** request removes a specific note.

- **User Route:**
  - Allows for updating and retrieving user information.

## Tech Stack
- **Backend Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Environment Management:** dotenv
- **Encryption:** crypto-js
- **Date Handling:** luxon

## Dependencies
```json
"dependencies": {
  "@types/crypto-js": "",
  "crypto-js": "",
  "dotenv": "",
  "express": "",
  "luxon": "",
  "mongoose": ""
}
```

## Instructions to Run the Code
1. **Clone the Repository:**
```sh
git clone https://github.com/Adeun-Ilemobola/expressNodeVap
cd expressNodeVap
```

2. **Install Dependencies:**
```sh
npm install
```

3. **Set Up Environment Variables:**
- Create a `.env` file in the root directory.
- Add the following variables:
```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

4. **Start the Server:**
```sh
npm run start
```

5. **Server Running At:**
```
http://localhost:5000
```

## API Endpoints
### Folder Routes
- **POST /folders/:userId**: Create a new folder.
- **PUT /folders/:userId/:folderId**: Update folder details.
- **DELETE /folders/:userId/:folderId**: Delete folder and associated notes.

### Note Routes
- **POST /notes/:userId**: Create a new note.
- **PUT /notes/:userId/:noteId**: Update note details.
- **DELETE /notes/:userId/:noteId**: Delete a specific note.

### User Routes
- **GET /user/:userId**: Retrieve user information.
- **PUT /user/:userId**: Update user information.

### Session Routes
- **GET /session**: Validate the current session.
- **POST /session/login**: Log the user in.
- **DELETE /session/logout**: Log the user out.

---

For front-end setup and integration, please refer to the [Front-End Repository](https://github.com/Adeun-Ilemobola/Douglas.FullStack).

