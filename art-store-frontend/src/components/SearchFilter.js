import React, { useState } from 'react';

function SearchFilter({ onSearch }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [artist, setArtist] = useState('');
  const [style, setStyle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ q: query, category, priceMin, priceMax, artist, style });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search and Filter Artworks</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-gray-700">Search (Keyword)</label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., Sunset, Abstract"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700">Category (Medium)</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">All Categories</option>
            <option value="Oil Painting">Oil Painting</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Watercolor">Watercolor</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Photography">Photography</option>
            <option value="Sculpture">Sculpture</option>
          </select>
        </div>
        <div>
          <label htmlFor="priceMin" className="block text-gray-700">Price Min ($)</label>
          <input
            type="number"
            id="priceMin"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., 100"
          />
        </div>
        <div>
          <label htmlFor="priceMax" className="block text-gray-700">Price Max ($)</label>
          <input
            type="number"
            id="priceMax"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., 200"
          />
        </div>
        <div>
          <label htmlFor="artist" className="block text-gray-700">Artist</label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., Jane Doe"
          />
        </div>
        <div>
          <label htmlFor="style" className="block text-gray-700">Style</label>
          <select
            id="style"
            value={style} // Changed from 'state' to 'style'
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">All Styles</option>
            <option value="Abstract">Abstract</option>
            <option value="Realism">Realism</option>
            <option value="Minimalism">Minimalism</option>
            <option value="Contemporary">Contemporary</option>
            <option value="Traditional">Traditional</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchFilter;