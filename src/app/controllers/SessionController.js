import * as Yup from 'yup';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(401).json({ error: 'Validation fails' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const isSamePassword = await user.checkPassword(password);

      if (!isSamePassword) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        token: jwt.sign(
          { id: user.id, name: user.name },
          authConfig.secret,
          {
            expiresIn: authConfig.expiresIn, // ou '7d'
          }
        ),
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao fazer login',
      });
    }
  }
}

export default new SessionController();