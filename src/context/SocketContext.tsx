import {BACKEND_URL} from '@env';
import React, {createContext, useContext, useEffect, useState} from 'react';
import socketio, {io} from 'socket.io-client';
import {useAuth} from './AuthContext';

const SocketContext = createContext<{
  socket: ReturnType<typeof socketio> | null;
}>({
  socket: null,
});

const getSocket = (authToken: string) => {
  return socketio(BACKEND_URL, {
    secure: true,
    auth: {token: authToken},
  });
};

const useSocket = () => useContext(SocketContext);

const SocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [socket, setSocket] = useState<ReturnType<typeof socketio> | null>(
    null,
  );
  const {authToken} = useAuth();

  useEffect(() => {
    if (authToken) {
      setSocket(getSocket(authToken));
    }
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>{children}</SocketContext.Provider>
  );
};

export {SocketProvider, useSocket};
