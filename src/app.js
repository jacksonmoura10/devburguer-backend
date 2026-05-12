import express from 'express';
import path from 'path';

import routes from './routes';

class App {
  constructor() {
    this.app = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use(
      '/uploads',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;