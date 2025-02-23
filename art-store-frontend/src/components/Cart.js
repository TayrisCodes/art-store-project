import React, { useState } from 'react';

const Cart = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    if (!cart.length) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cartItems: cart }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      // Handle successful checkout (e.g., redirect to success page)
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('Checkout process failed. Please try again later.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {error && <p className="text-red-500">{error}</p>}
      {/* Render cart items */}
      <ul>
        {cart.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={handleCheckout} className="bg-blue-500 text-white p-2 rounded">
        Checkout
      </button>
    </div>
  );
};

export default Cart;