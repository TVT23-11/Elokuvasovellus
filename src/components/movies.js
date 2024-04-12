import React, { useState, useEffect } from 'react';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {

    const fetchMovies = async () => {
      try {
        // päivämäärän haku
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // API URL elokuvien hakemiseen
        const apiUrl = `https://www.finnkino.fi/xml/Schedule/?area=&includePictures=true`;

        // Haetaan elokuvat API:sta
        const response = await fetch(apiUrl);
        const data = await response.text();
        const parser = new window.DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');

        const movieNodes = xmlData.querySelectorAll('Show');

        // Haetaan elokuvien tiedot, otsikot ja kuvat
        const moviesData = Array.from(movieNodes).map(movieNode => ({
          title: movieNode.querySelector('Title')?.textContent || '',
          genre: movieNode.querySelector('Genres')?.textContent || '',
          imageUrl: movieNode.querySelector('EventLargeImagePortrait')?.textContent || '',
        }));

        // Poistetaan päällekkäiset elokuvat
        const uniqueMovies = [];
        moviesData.forEach(movie => {
          if (!uniqueMovies.find(item => item.title === movie.title)) {
            uniqueMovies.push(movie);
          }
        });

        setMovies(uniqueMovies);
      } catch (error) {
        console.error('Ongelma ilmeni:', error);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  // Hakutoiminto
  useEffect(() => {
    let filteredMovies = [...movies];

    if (searchTerm) {
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== '') {
      filteredMovies = filteredMovies.filter(movie =>
        movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    console.log("Filtered movies:", filteredMovies);


    setSearchResults(filteredMovies);
  }, [searchTerm, selectedGenre, movies]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    return false; // Estää lomakkeen oletustoiminnon
  };

  const handleGenreChange = (event) => {
    console.log("Selected genre:", selectedGenre);
    setSelectedGenre(event.target.value);
  };

  return (
    <div className="movie-container">
      <h1>Tänään näytettävät elokuvat:</h1>

      <div className="search-container">
        <form onSubmit={(event) => handleSearchSubmit(event)}>
          <input
            type="text"
            placeholder="Hae elokuvia..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Hae</button>
        </form>
      </div>

      <div className="filter-container">
      <span>Suodatus: </span>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Kaikki genret</option>
          <option value="Toiminta">Toiminta</option>
          <option value="Komedia">Komedia</option>
          <option value="Perhe-elokuva">Koko perheelle</option>
          <option value="Draama">Draama</option>
          <option value="Jännitys">Jännitys</option>
          <option value="Kauhu">Kauhu</option>
          <option value="Romantiikka">Romantiikka</option>
        </select>
      </div>

      <div className="movie-grid">
        {searchResults.map((movie, index) => (
          <div className="movie-item" key={index}>
            <img src={movie.imageUrl} alt={movie.title} />
            <div>{movie.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;