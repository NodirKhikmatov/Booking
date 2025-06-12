import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';
import { Controller, Get, Logger } from '@nestjs/common';
import { Cron, Timeout } from '@nestjs/schedule';

import { BatchService } from './batch.service';

@Controller()
export class BatchController {
	private logger: Logger = new Logger('BatchController');
	constructor(private readonly batchService: BatchService) {}

	// @Get()
	// getHello(): string {
	// 	return this.batchService.getHello();
	// }

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('batch service ready');
	}

	@Cron('0 * * * * ', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('executed');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES })
	public async batchTopProperties() {
		try {
			this.logger['context'] = BATCH_TOP_PROPERTIES;
			this.logger.debug('executed');
			await this.batchService.batchTopProperties();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 * * * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('executed');
			await this.batchService.batchTopAgents();
		} catch (err) {
			this.logger.error(err);
		}
	}
}
