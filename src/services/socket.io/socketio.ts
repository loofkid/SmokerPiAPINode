import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

export let io: Server;

export const createIOClient = (httpServer: HttpServer) => {
    io = new Server(httpServer);
}