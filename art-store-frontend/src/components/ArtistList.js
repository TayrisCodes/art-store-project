import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { Link } from 'react-router-dom';

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/artists${searchQuery ? `/search?q=${searchQuery}` : ''}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch artists');
        return response.json();
      })
      .then((data) => setArtists(data))
      .catch((error) => {
        console.error('Error fetching artists:', error);
        setError('Unable to load artists. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Artist Directory</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search artists..."
        />
      </div>
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
      ) : artists.length > 0 ? (
        <ul className="space-y-4">
          {artists.map((artist) => (
            <li key={artist._id} className="border-b border-gray-200 py-4">
              <Link to={`/artists/${artist._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                {artist.name}
              </Link>
              <p className="text-gray-600 mt-1">{artist.bio.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No artists found.</p>
      )}
    </div>
  );
}

export default ArtistList;