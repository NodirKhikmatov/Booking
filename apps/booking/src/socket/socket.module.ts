import { AuthModule } from '../components/auth/auth.module';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
	providers: [SocketGateway],
	imports: [AuthModule],
})
export class SocketModule {}
