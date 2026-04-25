import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      admin: Yup.boolean(),


    });

    try {
      schema.validateSync(req.body, { abortEarly: false });

      const userExists = await User.findOne({ where: { email: req.body.email } });

      if (userExists) {
        return res.status(409).json({ error: 'Usuário já existe' });
      }

      const { name, email, password, admin } = req.body;

      const user = await User.create({
        id: uuidv4(),
        name,
        email,
        password, // será criptografado no model com hook
        admin: admin ?? false,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });

    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.errors });
      }

      console.error('Erro ao criar usuário:', err);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
    async index(req, res) {
    const users = await User.findAll();

    return res.status(200).json(users);
  }

}

export default new UserController();




