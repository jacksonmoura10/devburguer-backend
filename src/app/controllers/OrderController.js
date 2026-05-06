import * as Yup from 'yup';
import Category from '../models/Category';
import Product from '../models/Products';
import User from '../models/User';
import Order from '../schemas/Order';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
      });
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const { products } = request.body;

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      return {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        path: product.path,
        quantity: products[productIndex].quantity,
      };
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: 'Pedido realizado',
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

  async index(request, response) {
    try {
      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json({
          error: 'User is not admin',
        });
      }

      const orders = await Order.find();

      return response.json(orders);
    } catch (err) {
      return response.status(400).json({
        error: 'Não foi possível listar os pedidos',
      });
    }
  }

  async myOrders(request, response) {
    try {
      const orders = await Order.find({ 'user.id': request.userId });
      return response.json(orders);
    } catch (err) {
      return response.status(400).json({
        error: 'Não foi possível listar os pedidos',
      });
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
      });
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({
        error: 'User is not admin',
      });
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      const orderExists = await Order.findById(id);

      if (!orderExists) {
        return response.status(400).json({
          error: 'Order not found',
        });
      }

      await Order.updateOne(
        {
          _id: id,
        },
        {
          status,
        },
      );

      return response.json({
        message: 'Status atualizado com sucesso',
      });
    } catch (err) {
      return response.status(400).json({
        error: 'Erro ao atualizar o status do pedido',
      });
    }
  }
}

export default new OrderController();
