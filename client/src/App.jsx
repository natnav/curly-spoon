import { useState } from 'react';
import './App.css';

export default function App() {
  const [vibe, setVibe] = useState('');
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vibe.trim()) return;

    setLoading(true);
    setError('');
    setPlaylist(null);

    try {
      const res = await fetch('/api/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vibe }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        setPlaylist(data);
      }
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="ipod">
        <div className="screen">
          {playlist ? (
            <>
              <h2>{playlist.playlistName}</h2>
              <p>{playlist.description}</p>
            </>
          ) : (
            <>
              <h2>VibePlayer</h2>
              <p>Enter a vibe to get your playlist</p>
            </>
          )}
        </div>

        <form className="controls" onSubmit={handleSubmit}>
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="e.g. rainy day, hype, chill..."
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Play'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {playlist && (
          <div className="songs">
            {playlist.songs.map((song, i) => (
              <div key={i} className="song">
                {song.artwork ? (
                  <img src={song.artwork} alt={song.album} />
                ) : (
                  <div className="artwork-placeholder" />
                )}
                <div className="song-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="wheel">
          <div className="wheel-center" />
        </div>
      </div>
    </div>
  );
}
