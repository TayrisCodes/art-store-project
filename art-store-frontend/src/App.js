import React, { useEffect, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [artworks, setArtworks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Track logged-in user

  // Fetch artworks from the backend using environment variable or fallback to localhost
  useEffect(() => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/artworks`)
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

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle register
  const handleRegister = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/logout`, {
      method: 'GET',
      credentials: 'include', // Include cookies for session
    })
      .then((response) => response.json())
      .then(() => setUser(null))
      .catch((error) => console.error('Error logging out:', error));
  };

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
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-gray-800 hover:text-red-600 font-medium"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-gray-800 hover:text-blue-600 font-medium">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-800 hover:text-blue-600 font-medium">
                    Register
                  </Link>
                </li>
              </>
            )}
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
                        <ScaleLoader
                          color="gray"
                          height={48}
                          width={4}
                          radius={2}
                          margin={2}
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
                          <p className="mt-1 text-sm text-gray-500">{artwork.artist} - {artwork.medium || 'Unknown Medium'}</p>
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
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/artworks" element={<div>Artworks Page (Coming Soon)</div>} />
          <Route path="/artists" element={<div>Artists Page (Coming Soon)</div>} />
          <Route path="/membership" element={user ? <div>Membership Page (Coming Soon)</div> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;