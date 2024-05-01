import React, { useState, useEffect} from 'react';
import { useSearchParams } from "react-router-dom";

function Movies() {
const [favorites, setFavorites] = useState([]);
const [searchParams, setSearchParams] = useSearchParams();
const list = searchParams.get('list');
console.log(searchParams.get('list'));
useEffect(()=>{
  fetch('http://localhost:3001/favorites/getfavoritelist/' + list)
  .then(response=>response.json())
  .then(data=>
    {
      if(data == 'user not found'){
        console.error('user not found');
      }else{
      setFavorites(data);
      }
    })
  .catch(error=>console.error(error));
}, []);

  return (
    <div className='favoriteMovieListContainer'>
    {favorites.map((movie, i) => (
      <div className='movie-itemss' key={`movieItem${i}`}>
        <img src={movie.poster} alt={`Elokuvan ${movie.moviename} kuva`} height={150} key={`poster${i}`} />
        <div className='movieMovieTitleContainer' key={`movieMovieTitleContainer${i}`}>
          <div className='movieMovieTitle' key={`movieMovieTitle${i}`}>{movie.moviename}</div>
        </div>
      </div>
    ))}
  </div>
  );  
}

export default Movies;