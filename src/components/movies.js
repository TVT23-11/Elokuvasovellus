import React, { useState, useEffect } from 'react';

function Movies() {
  const [movies, setMovies] = useState([]);

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
          title: movieNode.querySelector('Title').textContent,
          imageUrl: movieNode.querySelector('EventLargeImagePortrait').textContent, 
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
  }, []);

  return (
    <div className="movie-container">
      <h1>Tänään näytettävät elokuvat:</h1>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div className="movie-item" key={index}>
            <img src={movie.imageUrl} alt={movie.title} />
            <span>{movie.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;
