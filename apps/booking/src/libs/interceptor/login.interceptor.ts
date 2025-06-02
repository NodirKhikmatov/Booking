import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const requestType = context.getType<GqlContextType>();

		if (requestType === 'http') {
			/* Develop if needed */
			return next.handle();
		} else if (requestType === 'graphql') {
			/* (1) Print Request */
			const gqlContext = GqlExecutionContext.create(context);
			console.log('gqlContext =>', gqlContext.getContext().req.body);
			this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');

			/* (2) Errors handling via GraphQL */

			/* (3) No errors, giving Response below */
			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime;
					this.logger.log(`${this.stringify(context)}-${responseTime}ms \n\n`, 'RESPONSE');
				}),
			);
		}

		// Ensure an Observable is returned for all cases to fix TS2366
		return next.handle();
	}

	// private stringify(data: any): string {
	// 	return JSON.stringify(data).slice(0, 75);

	private stringify(context: ExecutionContext): string {
		return JSON.stringify(context).slice(0, 75);
	}
}
