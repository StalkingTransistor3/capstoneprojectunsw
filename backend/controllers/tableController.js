const { default: mongoose } = require('mongoose');
const Table = require('../models/tableModel');

//////////////////////////////////////////////////////////////////
// GET
//////////////////////////////////////////////////////////////////

// GET /api/tables --> gets all the table
const getTables = async (req, res) => {
  const tables = await Table.find({}).sort({ tableNo: 1 });

  res.status(200).json(tables);
};

// GET /api/tables/no/:no --> gets a single table from table no
const getTableNo = async (req, res) => {
  const { no } = req.params;
  const table = await Table.findOne({ tableNo: no });

  if (!table) {
    return res.status(404).json({ error: 'Invalid table number' });
  }

  res.status(200).json(table);
};

// GET /api/tables/id/:id --> gets a single table from table id
const getTableId = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  const table = await Table.findById(id);

  if (!table) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  res.status(200).json(table);
};

//////////////////////////////////////////////////////////////////
// POST
//////////////////////////////////////////////////////////////////

// POST /api/tables --> creates a new table
const createTable = async (req, res) => {
  const { tableNo, seats } = req.body;

  // adding to db
  try {
    const table = await Table.create({
      tableNo,
      seats,
    });

    res.status(200).json(table);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//////////////////////////////////////////////////////////////////
// DELETE
//////////////////////////////////////////////////////////////////

// DELETE /api/tables/:id --> deletes a single table
const deleteTable = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  const table = await Table.findOneAndDelete({ _id: id });

  if (!table) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  res.status(200).json(table);
};

//////////////////////////////////////////////////////////////////
// PATCH
//////////////////////////////////////////////////////////////////

// PATCH /api/tables/:id --> updates a table
const updateTable = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  const table = await Table.findOneAndUpdate({ _id: id }, { ...req.body });

  if (!table) {
    return res.status(404).json({ error: 'Invalid table id' });
  }

  res.status(200).json(table);
};

//////////////////////////////////////////////////////////////////

module.exports = {
  getTables,
  getTableId,
  getTableNo,
  createTable,
  deleteTable,
  updateTable,
};

//////////////////////////////////////////////////////////////////
