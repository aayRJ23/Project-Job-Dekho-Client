import { io } from "socket.io-client";

// Single shared socket instance for the entire app
const socket = io("http://localhost:4000", {
  withCredentials: true,
  autoConnect: false, // We connect manually after login
});

export default socket;