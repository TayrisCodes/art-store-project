import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Full-Screen Banner */}
      <header className="w-full h-[60vh] bg-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to the Art Store</h1>
          <p className="mt-2 text-lg">Discover unique artworks from talented artists</p>
          <button className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">
            Explore Art
          </button>
        </div>
      </header>

      {/* Featured Art Section */}
      <section className="py-10 px-5">
        <h2 className="text-3xl font-semibold text-center mb-6">Featured Artworks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Placeholder artworks */}
          <div className="bg-white p-4 rounded shadow">
            <div className="h-48 bg-gray-300"></div>
            <h3 className="mt-2 text-xl">Artwork 1</h3>
            <p className="text-gray-600">$100</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="h-48 bg-gray-300"></div>
            <h3 className="mt-2 text-xl">Artwork 2</h3>
            <p className="text-gray-600">$150</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="h-48 bg-gray-300"></div>
            <h3 className="mt-2 text-xl">Artwork 3</h3>
            <p className="text-gray-600">$200</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;