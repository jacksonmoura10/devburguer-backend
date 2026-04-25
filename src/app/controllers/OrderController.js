import * as Yup from 'yup';
import Order from '../schemas/order';
import Product from '../models/Products';
import Category from '../models/Category';
import User from '../models/User';

class OrderController {
  // Criar um pedido
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
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;
    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: { id: productsIds },
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

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity,
      };
      return newProduct;
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: 'pedido realizado',
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

  // Listar pedidos
  async index(request, response) {
    try {
      const orders = await Order.find();
      return response.json(orders);
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Não foi possível listar os pedidos' });
    }
  }

  // Atualizar status do pedido
  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({ error: 'User is not admin' });
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      await Order.updateOne({ _id: id }, { status });
      return response.json({ message: 'Status atualizado com sucesso' });
    } catch (err) {
      return response
        .status(400)
        .json({ error: 'Erro ao atualizar o status do pedido' });
    }
  }
}

export default new OrderController();
