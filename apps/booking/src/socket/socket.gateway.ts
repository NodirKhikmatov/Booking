import * as url from 'url';

import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

import { AuthService } from '../components/auth/auth.service';
import { Logger } from '@nestjs/common';
import { Member } from '../libs/dto/member/member';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayLoad {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient = 0;
	private clientsAuthMap = new Map<WebSocket, Member>();
	private messageList: MessagePayload[] = [];

	constructor(private authService: AuthService) {}

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		this.logger.verbose(`WebSocket server initialized. Total clients: ${this.summaryClient}`);
	}

	private async retriveAuth(req: any): Promise<Member | null> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			console.log('token', token);
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retriveAuth(req);
		this.summaryClient++;
		this.clientsAuthMap.set(client, authMember!);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Client [${clientNick}] connected. Total: ${this.summaryClient}`);

		const infoMsg: InfoPayLoad = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember!,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messageList }));
	}

	public handleDisconnect(client: WebSocket) {
		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient--;
		this.clientsAuthMap.delete(client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Client [${clientNick}] disconnected. Total: ${this.summaryClient}`);

		const infoMsg: InfoPayLoad = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember!,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	async handleMessage(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client); // ✅ Retrieve stored member

		const newMessage: MessagePayload = {
			event: 'message',
			text: payload,
			memberData: authMember!,
		};
		this.messageList.push();
		if (this.messageList.length > 5) this.messageList.splice(0, this.messageList.length - 5);

		const clientNick: string = authMember?.memberNick ?? 'Guest';

		this.logger.verbose(`NEW MESSAGE: [${clientNick}] ${payload}`);
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

/*
client only client
brodcast except client 
emit al clients
*/
