import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch artworks from the backend
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/artworks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch artworks');
        }
        return response.json();
      })
      .then((data) => setArtworks(data))
      .catch((error) => {
        console.error('Error fetching artworks:', error);
        setError('Unable to load artworks. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-md p-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <Link to="/" className="text-gray-800 hover:text-blue-600 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/artworks" className="text-gray-800 hover:text-blue-600 font-medium">
                Artworks
              </Link>
            </li>
            <li>
              <Link to="/artists" className="text-gray-800 hover:text-blue-600 font-medium">
                Artists
              </Link>
            </li>
            <li>
              <Link to="/membership" className="text-gray-800 hover:text-blue-600 font-medium">
                Membership
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
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
                  <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">Featured Artworks</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {loading ? (
                      <div className="col-span-full flex justify-center items-center">
                        <RotatingLines
                          strokeColor="grey"
                          strokeWidth="5"
                          animationDuration="0.75"
                          width="96"
                          visible={true}
                        />
                      </div>
                    ) : error ? (
                      <p className="text-center col-span-full text-red-500">{error}</p>
                    ) : artworks.length > 0 ? (
                      artworks.map((artwork) => (
                        <div key={artwork.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                          <img
                            src={`https://source.unsplash.com/300x200/?art,${artwork.medium ? artwork.medium.toLowerCase() : 'default'}`}
                            alt={artwork.title}
                            className="h-48 w-full object-cover rounded"
                          />
                          <h3 className="mt-4 text-lg font-medium text-gray-900">{artwork.title}</h3>
                          <p className="mt-2 text-gray-600">${artwork.price}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {artwork.artist} - {artwork.medium || 'Unknown Medium'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center col-span-full">No artworks available.</p>
                    )}
                  </div>
                </section>
              </div>
            }
          />
          {/* Placeholder routes */}
          <Route path="/artworks" element={<div>Artworks Page (Coming Soon)</div>} />
          <Route path="/artists" element={<div>Artists Page (Coming Soon)</div>} />
          <Route path="/membership" element={<div>Membership Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;