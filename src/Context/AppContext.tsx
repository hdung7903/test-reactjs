import React, { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (!socket || socket.connected === false || !socket.id) {
      console.time("concatenation");
      const newSocket: Socket = io('http://localhost:8000', {
        withCredentials: true,
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
      });

      setSocket(newSocket);

      console.log('Socket connected', newSocket);
      console.timeEnd("concatenation");

      return () => {
        if (!socket && !socket.id) {
          newSocket.disconnect();
          console.log('Socket disconnected');
          setSocket(null);
        }
      };
    }
  }, []);


  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
