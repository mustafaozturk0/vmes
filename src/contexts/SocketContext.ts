import React from "react";
import io, { Socket } from "socket.io-client";
import { DevRootURL } from "../api/EndPoints";

export const socket = io(DevRootURL);

socket.connect();

socket.on("connect", () => {
  console.log("Socket connected");
});
socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});

socket.on("reconnect", () => {
  console.error("Socket reconnected:");
});

export const SocketContext = React.createContext<Socket>({} as any);
