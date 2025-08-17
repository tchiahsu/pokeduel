import { Socket } from "socket.io-client";
import { createContext, useContext } from "react";

// Create context for the socket instance
export const SocketContext = createContext<Socket | null>(null);

// Custom hook to access the socket from any component
export function useSocket() {
  const socket = useContext(SocketContext);

  // Handle null context value
  if (socket === null) {
    throw new Error("useSocket must be used with SocketContext");
  }

  return socket;
}
