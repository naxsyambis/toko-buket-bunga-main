const db = require('../config/database');

const getAllProducts = async (req, res) => {
  try {
    const [products] = await db.promise().query(`
      SELECT p.*, AVG(r.rating) as avg_rating 
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id 
      GROUP BY p.id
    `);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getProductById = async (req, res) => {
  try {
    const [products] = await db.promise().query(`
      SELECT p.*, AVG(r.rating) as avg_rating 
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id 
      WHERE p.id = ?
      GROUP BY p.id
    `, [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const [reviews] = await db.promise().query(`
      SELECT r.*, u.name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ?
    `, [req.params.id]);
    
    res.json({ product: products[0], reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  try {
    const [result] = await db.promise().query(
      'INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, category, image]
    );
    
    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ? WHERE id = ?',
      [name, description, price, stock, category, id]
    );
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};