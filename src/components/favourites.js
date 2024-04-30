import React, { useState, useEffect } from 'react';
import { jwtToken } from './authSignals';

export default function Favorites() {

  const [favorites, setFavorites] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/favorites/' + jwtToken.value)
      .then(response => response.json())
      .then(data => setFavorites(data))
      .catch(error => console.error('Error fetching favorites:', error));

      if (jwtToken.value) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
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

  const [userid, setUserId] = useState('');

  useEffect(()=>{
    fetch('http://localhost:3001/user/getUserId?token=' + jwtToken.value)
    .then(response=>response.json())
    .then(data=>
      {
        if(data.iduser){
          setUserId(data.iduser);
        }else{
          console.log(data);
        }
      })
    .catch(error=>console.error(error));
  }, []);

  return (
    <div className='movieFormContainer'>
      {isLoggedIn && (
        <div className="shareOptionsContainer">
          Jaa suosikkilistasi tällä linkillä: http://localhost:3000/movies/?list={userid}
        </div>
      )}<div className='favoriteMovieListContainer'>

      {favorites.map((movie, i) => (
        <div className='movie-itemss' key={`movieItem${i}`}>
          <img src={movie.poster} alt={`Elokuvan ${movie.moviename} kuva`} height={150} key={`poster${i}`} />
          <div className='movieMovieTitleContainer' key={`movieMovieTitleContainer${i}`}>
            <div className='movieMovieTitle' key={`movieMovieTitle${i}`}>{movie.moviename}</div>
          </div>
          <div id={`deleteFavoritesButtonContainer_${movie.idmovie}`}>
            <button className="deleteFavoritesButton searchPageButton" onClick={() => deleteFavorites(movie.idmovie)}>Poista suosikki</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}