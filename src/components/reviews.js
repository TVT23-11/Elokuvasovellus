import React, { useState, useEffect } from 'react';

export default function Review() {

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/review/')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching groups:', error));

  }, []);

  return (
    <div className='reviewFormContainer'>
      {reviews.map((review, i) =>
        <div className='review-item' key={`reviewItem${i}`}>
          <img src={review.poster} alt={`Elokuvan ${review.moviename} kuva`} height={150} key={`poster${i}`}/>
          <div className='reviewMovieTitleContainer'  key={`reviewMovieTitleContainer${i}`}>
            <div className='reviewMovieTitle' key={`reviewMovieTitle${i}`}>{review.moviename}</div>
            <div className='reviewStarsContainer' key={`reviewStarsContainer${i}`}>
              {review.numberofstars > 0 ? (
              <img src={'/img/star_full.jpg'} className='reviewStarImage' />
              ):(
                <img src={'/img/star_empty.jpg'} className='reviewStarImage' />
              )}
              {review.numberofstars > 1 ? (
              <img src={'/img/star_full.jpg'} className='reviewStarImage' />
              ):(
                <img src={'/img/star_empty.jpg'} className='reviewStarImage' />
              )}
              {review.numberofstars > 2 ? (
              <img src={'/img/star_full.jpg'} className='reviewStarImage' />
              ):(
                <img src={'/img/star_empty.jpg'} className='reviewStarImage' />
              )}
              {review.numberofstars > 3 ? (
              <img src={'/img/star_full.jpg'} className='reviewStarImage' />
              ):(
                <img src={'/img/star_empty.jpg'} className='reviewStarImage' />
              )}
              {review.numberofstars > 4 ? (
              <img src={'/img/star_full.jpg'} className='reviewStarImage' />
              ):(
                <img src={'/img/star_empty.jpg'} className='reviewStarImage' />
              )}
              
            </div>
            <div className='reviewerContainer' key={`reviewerContainer${i}`}>{review.username}</div>
          </div>
          <div className='reviewText' key={`reviewText${i}`}>{review.review}</div>
        </div>
      )}
    </div>
  )
}
