import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

import { Logger } from '@nestjs/common';

interface MessagePayload {
	event: string;
	text: string;
}

interface InfoPayLoad {
	event: string;
	totalClients: number;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient = 0;

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		this.logger.verbose(`WebSocket server initialized. Total clients: ${this.summaryClient}`);
	}

	handleConnection(client: WebSocket) {
		this.summaryClient++;
		this.logger.verbose(`Client connected. Total: ${this.summaryClient}`);

		const infoMsg: InfoPayLoad = {
			event: 'info',
			totalClients: this.summaryClient,
		};
		this.emitMessage(infoMsg);
	}

	handleDisconnect(client: WebSocket) {
		this.summaryClient--;
		this.logger.verbose(`Client disconnected. Total: ${this.summaryClient}`);

		const infoMsg: InfoPayLoad = {
			event: 'info',
			totalClients: this.summaryClient,
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	async handleMessage(client: WebSocket, payload: any): Promise<void> {
		const newMessage: MessagePayload = { event: 'message', text: payload };

		this.logger.verbose(`NEW MESSAGE: ${payload}`);
		this.emitMessage(newMessage);
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayLoad) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayLoad | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}
