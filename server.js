import connectDB from "./config/db.js";
import app from "./app.js";
import { createServer } from 'http';
import { initSocket } from './config/socket.js';

connectDB();

const PORT = process.env.PORT ;



const server = httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


export default server;