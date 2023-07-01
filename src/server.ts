import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import Router from './routes/router';
import path from 'path';

(async () => {
    const { server } = await makeServer();

    const close = () => {
        server.close(() => {
            // Other things to cleanup
            console.log('Http server closed.');
            process.exit(0);
        });
    };

    process.on('SIGINT', () => {
        console.log('Received SIGINT. Shutting down now.');
        close();
    });

    process.on('SIGTERM', () => {
        console.log('All requests finished. Shutting down now.');
        close();
    });
})();

export async function makeServer() {
    const app: Express = express();
    const APP_PORT = 3000;
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Static setup
    app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
    app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
    app.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

    app.get('/', (req: Request, res: Response) => {
        res.sendFile("index.html", { root: __dirname });
    });

    app.use("/", Router);

    /** Global Error Handler */
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    });

    const server = app.listen(APP_PORT, () => {
        console.log(`[Server]: Started on http://localhost:${APP_PORT}`);
    });
    return { app, server };
}