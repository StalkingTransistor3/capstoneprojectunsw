const express = require('express');

const {
  getTables,
  getTableId,
  getTableNo,
  createTable,
  deleteTable,
  updateTable,
} = require('../controllers/tableController');

const router = express.Router();

// GET: /api/tables
router.get('/', getTables);
// GET: /api/tables/no/:no
router.get('/no/:no', getTableNo);
// GET /api/tables/id/:id
router.get('/id/:id', getTableId);
// POST /api/tables
router.post('/', createTable);
// DELETE /api/tables/:id
router.delete('/:id', deleteTable);
// PATCH /api/tables/:id
router.patch('/:id', updateTable);

module.exports = router;
