const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token',
      details: error.message
    });
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Vulnerable Shop API is running' });
});

app.post('/api/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `INSERT INTO users (email, password, role)
       VALUES ('${email}', '${password}', 'user')
       RETURNING id, email, role`
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, email, role 
       FROM users 
       WHERE email = '${email}' AND password = '${password}'`
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      token,
      user
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    const search = req.query.search || '';

    const query = `
      SELECT *
      FROM products
      WHERE name ILIKE '%${search}%'
      OR description ILIKE '%${search}%'
      ORDER BY id
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders/:id', authMiddleware, async (req, res, next) => {
  try {
    const orderId = req.params.id;

    const result = await pool.query(`
      SELECT o.id, o.user_id, p.name AS product_name, o.quantity, o.total
      FROM orders o
      JOIN products p ON p.id = o.product_id
      WHERE o.id = ${orderId}
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/users', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

app.post('/api/products/:productId/reviews', authMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;

    const result = await pool.query(`
      INSERT INTO reviews (product_id, user_id, content)
      VALUES (${productId}, ${req.user.id}, '${content}')
      RETURNING id, product_id, user_id, content
    `);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:productId/reviews', async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(`
      SELECT r.id, r.content, u.email
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.product_id = ${productId}
      ORDER BY r.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});
app.put('/api/orders/:id/quantity', authMiddleware, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { quantity } = req.body;

    const result = await pool.query(`
      UPDATE orders
      SET quantity = ${quantity}
      WHERE id = ${orderId}
      RETURNING id, user_id, product_id, quantity, total
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message,
    stack: error.stack,
    sql: error.query
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Vulnerable API running on port ${process.env.PORT || 5000}`);
});