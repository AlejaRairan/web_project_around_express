const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer los datos' });
    res.json(JSON.parse(data));
  });
});

router.get('/:id', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer los datos' });

    const users = JSON.parse(data);
    const user = users.find((u) => u._id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'ID de usuario no encontrado' });
    }

    return res.json(user);
  });
});

module.exports = router;