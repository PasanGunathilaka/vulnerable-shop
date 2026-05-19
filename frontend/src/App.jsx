import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [email, setEmail] = useState('user1@test.com');
  const [password, setPassword] = useState('12345');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);

  const [orderId, setOrderId] = useState('1');
  const [order, setOrder] = useState(null);

  const [adminUsers, setAdminUsers] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState('1');
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState([]);

  async function login() {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      });

      setToken(response.data.token);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      alert('Login failed');
      console.error(error);
    }
  }

  function logout() {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
  }

  async function loadProducts() {
    const response = await axios.get(`${API_URL}/api/products?search=${search}`);
    setProducts(response.data);
  }

  async function loadOrder() {
    try {
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrder(response.data);
    } catch (error) {
      alert('Could not load order');
      console.error(error);
    }
  }

  async function loadAdminUsers() {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAdminUsers(response.data);
    } catch (error) {
      alert('Could not load admin users');
      console.error(error);
    }
  }

  async function addReview() {
    try {
      await axios.post(
        `${API_URL}/api/products/${selectedProductId}/reviews`,
        {
          content: reviewContent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReviewContent('');
      loadReviews();
    } catch (error) {
      alert('Could not add review');
      console.error(error);
    }
  }

  async function loadReviews() {
    const response = await axios.get(`${API_URL}/api/products/${selectedProductId}/reviews`);
    setReviews(response.data);
  }

  useEffect(() => {
    loadProducts();
    loadReviews();
  }, []);

  return (
    <div className="page">
      <h1>Vulnerable Shop</h1>
      <p className="warning">Training app only. Do not deploy publicly.</p>

      <section className="card">
        <h2>Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />

        {!token ? (
          <button onClick={login}>Login</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {user && (
          <p>
            Logged in as <b>{user.email}</b> ({user.role})
          </p>
        )}

        <p>Test users:</p>
        <ul>
          <li>admin@test.com / 12345</li>
          <li>user1@test.com / 12345</li>
          <li>user2@test.com / 12345</li>
        </ul>
      </section>

      <section className="card">
        <h2>Product Search</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
        />

        <button onClick={loadProducts}>Search</button>

        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <b>{product.name}</b> - {product.description} - ${product.price}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Order Details</h2>

        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Order ID"
        />

        <button onClick={loadOrder}>Load Order</button>

        {order && (
          <pre>{JSON.stringify(order, null, 2)}</pre>
        )}
      </section>

      <section className="card">
        <h2>Admin Users</h2>
        <button onClick={loadAdminUsers}>Load Users</button>

        <ul>
          {adminUsers.map((u) => (
            <li key={u.id}>
              {u.email} - {u.role}
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Product Reviews</h2>

        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="1">Laptop</option>
          <option value="2">Mouse</option>
          <option value="3">Keyboard</option>
          <option value="4">Monitor</option>
        </select>

        <button onClick={loadReviews}>Load Reviews</button>

        <textarea
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
          placeholder="Write review"
        />

        <button onClick={addReview}>Add Review</button>

        <div>
          {reviews.map((review) => (
            <div key={review.id} className="review">
              <p><b>{review.email}</b></p>

              <div dangerouslySetInnerHTML={{ __html: review.content }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);