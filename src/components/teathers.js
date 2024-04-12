import React, { useState, useEffect } from 'react';

// Alustetaan päivämäärän tiedot
const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
const formattedDate = `${year}-${month}-${day}`;

function Theaters() {
  // Tilamuuttujat teattereille, valitulle teatterille, elokuville, valitulle esitysajalle ja esitysajoille
  const [theaters, setTheaters] = useState([]);
  const [selectedTheater, setSelectedTheater] = useState("");
  const [movies, setMovies] = useState([]); // Elokuvat
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [showtimes, setShowtimes] = useState([]);

  // Haetaan teatterit käyttäen API:naa
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theatersUrl = `https://www.finnkino.fi/xml/TheatreAreas/`;
        // Haetaan teatterit
        const response = await fetch(theatersUrl);
        const data = await response.text();
        const parser = new window.DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');
        const theaterNodes = xmlData.querySelectorAll('TheatreArea');
        const theaterList = Array.from(theaterNodes).map(theater => ({
          id: theater.querySelector('ID').textContent,
          name: theater.querySelector('Name').textContent
        }))
        .filter(theater => theater.id !== '1014' && theater.id !== '1012' && theater.id !== '1002' && theater.id !== '1021'); // Suodatetaan tietyt teatterit pois
        setTheaters(theaterList);
      } catch (error) {
        console.error('Hupsis:', error);
      }
    };

    fetchTheaters();
  }, []); 

  // Haetaan valitun teatterin elokuvat käyttäen API:a
  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedTheater !== "") {
        try {
          const moviesUrl = `https://www.finnkino.fi/xml/Schedule/?area=${selectedTheater}&dt=${formattedDate}`;
          // Haetaan elokuvat
          const response = await fetch(moviesUrl);
          const data = await response.text();
          const parser = new window.DOMParser();
          const xmlData = parser.parseFromString(data, 'text/xml');
          const movieNodes = xmlData.querySelectorAll('Show');
          const movieList = Array.from(movieNodes).reduce((acc, movie) => {
            const id = movie.querySelector('EventID').textContent;
            if (!acc[id]) {
              acc[id] = {
                id,
                title: movie.querySelector('Title').textContent,
                start: movie.querySelector('dttmShowStart').textContent,
                image: movie.querySelector('EventLargeImagePortrait').textContent,
                showtimes: [movie.querySelector('dttmShowStart').textContent]
              };
            } else {
              acc[id].showtimes.push(movie.querySelector('dttmShowStart').textContent);
            }
            return acc;
          }, {});

          setMovies(Object.values(movieList));
        } catch (error) {
          console.error('Hupsis:', error);
        }
      }
    };

    fetchMovies();
  }, [selectedTheater, formattedDate]);

  // Käsitellään teatterin valinta
  const handleChangeTheater = (event) => {
    setSelectedTheater(event.target.value);
    setSelectedShowtime("");
  };

  const handleChangeShowtime = (event) => {
    setSelectedShowtime(event.target.value);
  };

  useEffect(() => {
    if (movies.length > 0) {
      const allShowtimes = movies.flatMap(movie => movie.showtimes);
      const uniqueShowtimes = Array.from(new Set(allShowtimes.map(time => time.substring(11, 16)))); // Poistetaan duplikaatit ja muotoillaan esitysajat
      setShowtimes(uniqueShowtimes);
    }
  }, [movies]);

  return (
    <div>
      <h1>Kaikki teatterit</h1>
      <select value={selectedTheater} onChange={handleChangeTheater}>
        <option value="">Valitse teatteri</option>
        {theaters.map(theater => (
          <option key={theater.id} value={theater.id}>{theater.name}</option>
        ))}
      </select>
      {movies.length > 0 && (
  <div className="movie-grid">
    {movies.map((movie, index) => (
      <div className="movie-item" key={index}>
        <img src={movie.image} alt={movie.title} />
        <span className="movie-title">{movie.title}</span>
        <select onChange={handleChangeShowtime}>
          <option value="">Valitse esitysaika</option>
          {movie.showtimes && movie.showtimes.map((showtime, index) => (
            <option key={index} value={showtime}>{showtime.substring(11, 16)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Theaters;
