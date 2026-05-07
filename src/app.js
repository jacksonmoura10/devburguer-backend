import cors from 'cors';
import express from 'express';
import { resolve } from 'node:path';
import './database/index';
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(
      cors({
        origin: ['http://localhost:5173', 'https://paulislanches.vercel.app'],
      }),
    );
    this.app.use(express.json());

    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads')),
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
