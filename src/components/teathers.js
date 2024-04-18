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
  const [selectedTheaterName, setSelectedTheaterName] = useState(""); // Tallennetaan valitun teatterin nimi
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
    // Asetetaan valitun teatterin nimi
    const selectedTheaterObject = theaters.find(theater => theater.id === event.target.value);
    setSelectedTheaterName(selectedTheaterObject ? selectedTheaterObject.name : "");
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
      <div className="custom-dropdown">
        <button className="custom-dropdown-btn">Valitse teatteri</button>
        <div className="custom-dropdown-content">
          {theaters.map(theater => (
            <a key={theater.id} href="#" onClick={() => handleChangeTheater({target: {value: theater.id}})}>{theater.name}</a>
          ))}
        </div>
      </div>
      {/* Tulostetaan valittu teatteri */}
      {selectedTheaterName && (
        <div className="selected-theater">
          {[...Array(100)].map((_, index) => (
            <span key={index}>{selectedTheaterName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          ))}
        </div>
      )}
      {movies.length > 0 && (
        <div className="movie-grids">
          {movies.map((movie, index) => (
            <div className="movie-items" key={index}>
              <div className="movie-details">
                <span className="movie-title">{movie.title}</span>
                <img src={movie.image} alt={movie.title} />
              </div>
              <div className="showtimes">
                <h3>Esitysajat</h3>
                <ul>
                  {movie.showtimes && movie.showtimes.map((showtime, index) => (
                    <li key={index}>{showtime.substring(11, 16)}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Theaters;
