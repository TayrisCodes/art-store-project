import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

function Membership({ user }) {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTier, setNewTier] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/membership/status`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch membership status');
        return response.json();
      })
      .then((data) => setMembership(data.membershipTier))
      .catch((error) => {
        console.error('Error fetching membership status:', error);
        setError('Unable to load membership status. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!newTier) return setError('Please select a membership tier');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/membership/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tier: newTier }),
      });
      if (!response.ok) throw new Error('Membership upgrade failed');
      const data = await response.json();
      setMembership(newTier);
      setError(null);
      setNewTier('');
    } catch (error) {
      console.error('Error upgrading membership:', error);
      setError('Failed to upgrade membership. Please try again later.');
    }
  };

  if (!user) return <p className="text-center mt-10">Please log in to view membership details.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Membership</h2>
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
      ) : (
        <>
          <p className="text-gray-600 mb-4">Current Membership Tier: {membership || 'Free'}</p>
          <form onSubmit={handleUpgrade} className="space-y-4">
            <div>
              <label htmlFor="tier" className="block text-gray-700">Upgrade Membership</label>
              <select
                id="tier"
                value={newTier}
                onChange={(e) => setNewTier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              >
                <option value="">Select Tier</option>
                <option value="Basic">Basic ($5/month)</option>
                <option value="Premium">Premium ($10/month)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Upgrade
            </button>
          </form>
          {membership === 'Premium' && (
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Exclusive Benefits</h3>
              <p className="text-gray-600">Early access to new artworks and special discounts!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Membership;