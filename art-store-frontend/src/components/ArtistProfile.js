import React, { useState, useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';

function ArtistProfile({ match }) {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/artists/${match.params.id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch artist profile');
        return response.json();
      })
      .then((data) => setArtist(data))
      .catch((error) => {
        console.error('Error fetching artist profile:', error);
        setError('Unable to load artist profile. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [match.params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ScaleLoader
          color="gray"
          height={48}
          width={4}
          radius={2}
          margin={2}
        />
      </div>
    );
  }

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!artist) return <p className="text-center mt-10">Artist not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{artist.name}</h2>
      <p className="text-gray-600 mb-4">{artist.bio}</p>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Achievements</h3>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        {artist.achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Social Links</h3>
      <ul className="list-disc list-inside text-gray-600 mb-4">
        {Object.entries(artist.socialLinks).map(([platform, url]) => (
          <li key={platform}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{platform}</a></li>
        ))}
      </ul>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Artworks</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artist.artworks.map((artwork) => (
          <div key={artwork.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <img
              src={`https://source.unsplash.com/300x200/?art,${artwork.medium.toLowerCase()}`}
              alt={artwork.title}
              className="h-48 w-full object-cover rounded"
            />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{artwork.title}</h3>
            <p className="mt-2 text-gray-600">${artwork.price}</p>
            <p className="mt-1 text-sm text-gray-500">{artwork.artist} - {artwork.medium}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtistProfile;