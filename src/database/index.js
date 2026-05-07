import 'dotenv/config';
import mongoose from 'mongoose';
import Sequelize from 'sequelize';
import Category from '../app/models/Category.js';
import Product from '../app/models/Products.js';
import User from '../app/models/User.js';
import configDatabase from '../config/database.js';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(configDatabase);

    this.connection
      .authenticate()
      .then(() => console.log('sequelize conectado com sucesso'))
      .catch((err) => console.error('erro no sequelize:', err));

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }

  async mongo() {
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      });
      console.log('✅ MongoDB conectado com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao conectar ao MongoDB:', err);
    }
  }
}

export default new Database();
