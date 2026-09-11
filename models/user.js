const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+[/#?]?/.test(v);
      },
      message: (props) => `${props.value} no es una URL válida`,
    },

  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: (props) => `${props.value} no es un correo electrónico válido`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  }
});

module.exports = mongoose.model('user', userSchema);