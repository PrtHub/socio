import { NextApiRequest } from "next";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseWithSocket } from "@/types";

export const config = {
    api: {
        bodyParser: false
    }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
    if (!res.socket.server.io) {
        const httpServer: NetServer = res.socket.server as unknown as NetServer;
        
        const io = new ServerIO(httpServer, {
            path: '/api/socket/io',
            addTrailingSlash: false
        });
        
        res.socket.server.io = io;
    }
    res.end()
};

export default ioHandler