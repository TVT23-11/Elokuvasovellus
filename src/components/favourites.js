import React, { useState, useEffect } from 'react';
import { jwtToken } from './authSignals';

export default function Favorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/favorites/' + jwtToken.value)
      .then(response => response.json())
      .then(data => setFavorites(data))
      .catch(error => console.error('Error fetching favorites:', error));

  }, []);

  const deleteFavorites = (movieid) => {
    document.getElementById(`deleteFavoritesButtonContainer_${movieid}`).innerHTML = 'Suosikki poistettu';
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${jwtToken.value}`
      }
    };
    console.log(jwtToken.value, movieid);
    // Lähetetään pyyntö backendiin
    fetch(`http://localhost:3001/favorites/deleteFavorite/${jwtToken.value}/${movieid}`, requestOptions)
    .then(response => response.json())
        .then(data => {
          console.log('Suosikki poistettu:', data);
        })
        .catch(error => console.error('Virhe lisättäessä suosikkiin:', error));
  };

  return (
    <div className='movieFormContainer'>
      {favorites.map((movie, i) =>
        <div className='movie-itemss' key={`movieItem${i}`}>
          <img src={movie.poster} alt={`Elokuvan ${movie.moviename} kuva`} height={150} key={`poster${i}`} />
          <div className='movieMovieTitleContainer' key={`movieMovieTitleContainer${i}`}>
            <div className='movieMovieTitle' key={`movieMovieTitle${i}`}>{movie.moviename}</div>
            </div>
                <div id={`deleteFavoritesButtonContainer_${movie.idmovie}`}>
                    <button className="deleteFavoritesButton searchPageButton" onClick={() => deleteFavorites(movie.idmovie)}>Poista suosikki</button>
                </div>
            </div>
        )}
    </div>
)
}