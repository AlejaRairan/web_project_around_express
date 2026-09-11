const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { JWT_SECRET = 'secret-key' } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new NotFoundError('ID de usuario no encontrado');
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID no válido'));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new NotFoundError('Usuario no encontrado');
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => next(err));
}


module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash,
      name: name,
      about: about,
      avatar: avatar,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {

      if (err.code === 11000) {
        return next(new ConflictError('El correo electrónico ya está en uso'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });

};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Usuario no encontrado'));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID no válido'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Usuario no encontrado'));
      }
      return res.json(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('ID no válido'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {

      if (!user) {
        return next(new UnauthorizedError('Correo electrónico o contraseña incorrectos'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Correo electrónico o contraseña incorrectos'));
          }
          return res.status(200).send({ token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }) });
        });
    })
    .catch((err) => next(err));
};