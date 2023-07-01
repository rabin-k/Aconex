import { Request, Response, NextFunction } from 'express';
import express from 'express';
import bodyParser from 'body-parser';
import Router from '../routes/router';

export function createMockApp() {
	const app = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use((req: Request, res: Response, next: NextFunction) => {
		next();
	});

	app.use('/', Router);

	return app;
}
