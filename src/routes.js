import express from 'express';

import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';
import ProductController from './app/controllers/ProductController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';
import upload from './config/multer';

const routes = express.Router();

//
// ROTAS PÚBLICAS
//

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

//
// MIDDLEWARE DE AUTENTICAÇÃO
//

routes.use(authMiddleware);

//
// PRODUTOS
//

routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id', upload.single('file'), ProductController.update);
routes.delete('/products/:id', ProductController.delete);

//
// CATEGORIAS
//

routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', upload.single('file'), CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

//
// PEDIDOS
//

routes.post('/orders', OrderController.store);
routes.get('/orders/my-orders', OrderController.myOrders);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

export default routes;
