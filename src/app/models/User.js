import bcrypt from 'bcryptjs';
import { DataTypes, Model } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },

        name: DataTypes.STRING,

        email: DataTypes.STRING,

        password: DataTypes.VIRTUAL,

        password_hash: DataTypes.STRING,

        admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
        underscored: true,
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;