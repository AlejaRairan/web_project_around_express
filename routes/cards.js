const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, '../data/cards.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error al leer los datos' });
    res.json(JSON.parse(data));
  });
});

module.exports = router;