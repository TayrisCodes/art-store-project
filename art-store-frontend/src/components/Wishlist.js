import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

function Wishlist({ user }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/wishlist`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        return response.json();
      })
      .then((data) => setWishlist(data))
      .catch((error) => {
        console.error('Error fetching wishlist:', error);
        setError('Unable to load wishlist. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddToCart = async (artworkId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ artworkId }),
      });
      setWishlist(wishlist.filter(item => item.artworkId !== artworkId));
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add to cart. Please try again later.');
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in to view your wishlist.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Wishlist</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <div className="flex justify-center items-center">
          <ScaleLoader
            color="gray"
            height={48}
            width={4}
            radius={2}
            margin={2}
          />
        </div>
      ) : wishlist.length > 0 ? (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item._id} className="border-b border-gray-200 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{item.artwork.title}</h3>
                  <p className="text-gray-600">${item.artwork.price}</p>
                  <p className="text-sm text-gray-500">{item.artwork.artist} - {item.artwork.medium}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(item.artworkId)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  );
}

export default Wishlist;