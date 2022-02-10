import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from "http";
import { PassportStatic } from "passport";

export let io: Server;

const wrap = (middleware)  => (socket: Socket, next: () => any) => middleware(socket.request, {}, next);

export const createIOClient = (httpServer: HttpServer) => {
    io = new Server(httpServer);
}

export const registerPassportAuth = (passport: PassportStatic) => {
    io.use(wrap(passport.initialize));
}