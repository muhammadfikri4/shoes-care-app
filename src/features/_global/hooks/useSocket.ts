import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { CONFIG_APP } from "../../../core/configs/app";

export let socket: Socket | null = null;

export function useSocket() {
  const token = localStorage.getItem(CONFIG_APP.TOKEN_KEY);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    if (!socket) {
      socket = io(CONFIG_APP.BASE_URL, {
        auth: { token },
      });
    }

    socketRef.current = socket;

    // login sekali aja
    if (token) {
      socket.emit("login", token);
    }

    return () => {
      socket?.off("user-status");
    };
  }, [token]);

  return socketRef.current as Socket;
}
