import React, { useState, useEffect } from 'react';
import { jwtToken } from './authSignals';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [setError] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('0');

    const [movies, setMovies] = useState([]);
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchTerm) {
            alert('Syötä elokuvan nimi.');
            return;
        }

        let hakusana = encodeURIComponent(searchTerm);
        let vuosi = '';
        console.log('&year=' + document.getElementById('yearDropdown').value);
        if (document.getElementById('yearDropdown').value > 0) {
            vuosi = '&year=' + document.getElementById('yearDropdown').value
        }
        console.log('http://localhost:3001/TMDB/elokuvahaku?hakusana=' + hakusana + vuosi);
        fetch('http://localhost:3001/TMDB/elokuvahaku?hakusana=' + hakusana + vuosi)
            .then(response => response.json())
            .then(data => {
                //let json = JSON.parse(data).results;
                console.log(JSON.parse(data).results);
                setMovies(JSON.parse(data).results);
            })
            .catch(error => {
                console.error(error);
            });
    };

    let token = '';
    if (jwtToken.value.length > 1) {
        token = jwtToken.value;
    }

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/groups/All/' + token)
            .then(response => response.json())
            .then((data) => {
                let groupData = new Array();
                for (let i = 0; i < data.length; i++) {
                    if (data[i].ismember === '1' && data[i].isaccepted == true) {
                        groupData.push({ id: data[i].idgroup, name: data[i].name });
                    }
                }
                setGroups(groupData);
            })
            .catch(error => console.error('Error fetching groups:', error));

    }, []);
    const [selectedMovieToGroupList, setSelectedMovieToGroupList] = useState([]);
    const selectGroup = (id) => {
        setSelectedMovieToGroupList(id);
    };
    const addToGroupMovieList = (group, movie, movieid, poster) => {
        console.log(group, movie, movieid, poster);
        const data = {
            group: group,
            moviename: movie,
            movieid: movieid,
            poster: poster
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch('http://localhost:3001/groups/addToMovieList/', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    console.log(data.message);
                    document.getElementById(`addToGroupList_SelectGroupContainer_${movieid}`).innerHTML = '<span class="successText">Esitys lisätty ryhmän listalle</span>';
                }
            });

    };
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [review, setReview] = useState([]);

    const addReview = (id, movie, poster) => {
        console.log(id, movie, poster);
        setShowReviewForm(true);
        setReview({ id: id, movie: movie, poster: poster });
    };

    const closeReviewForm = () => {
        setShowReviewForm(false);
        setReviewSuccessful(false);
        setReview({ id: '', movie: '', poster: '' });
    };

    const [reviewSuccessful, setReviewSuccessful] = useState(false);

    const saveReview = () => {
        let movieid, movietitle, poster, reviewText, stars;
        movieid = review.id;
        movietitle = review.movie;
        poster = review.poster;
        reviewText = document.getElementById('reviewText').value;
        stars = document.getElementById('reviewStars').value;

        console.log(movieid, movietitle, poster, reviewText, stars);

        const data = {
            token: jwtToken.value,
            id: movieid,
            movie: movietitle,
            poster: poster,
            reviewText: reviewText,
            stars: stars
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch('http://localhost:3001/review/addReview/', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.message = 'success') {
                    // Arvostelu lisätty onnistuneesti
                    setReviewSuccessful(true);
                } else {
                    console.error(data);
                }
            })
            .catch(error => console.error('Error fetching groups:', error));
    };

    function ReviewForm() {
        return (
            <div>
                <button className='ReturnToSearchResults' onClick={() => closeReviewForm()}>Palaa hakusivulle</button>
                {reviewSuccessful ? (
                    <div>Arvostelu lisätty onnistuneesti!</div>
                ) : (
                    <div className='searchReviewFormContainer'>
                        <img src={review.poster} alt={`Elokuvan ${review.movie} kuva`} height={150} />
                        <div className='searchReviewMovieTitle'>{review.movie}</div>
                        <div className='searchReviewTextContainer'>
                            <textarea className='searchReviewTextarea' id='reviewText' rows={10} cols={60} placeholder="Kirjoita arvostelu..." ></textarea>
                        </div>
                        <div className='searchReviewStarsContainer'>
                            <select className='searchReviewStars' id='reviewStars'>
                                <option value=''>Valitse arvosana</option>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                            </select>
                        </div>
                        <button className='searchSaveReview' onClick={() => saveReview()}>Tallenna arvostelu</button>
                    </div>
                )}

            </div>
        );
    }

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/TMDB/genre')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fetch-virhe: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                let json = JSON.parse(data);
                setGenres(json.genres);
            })
            .catch(error => {
                console.error('Genren Hakuvirhe:', error.message);
            });
    }, []);

    const addToFavorites = (movieid, original_title, poster) => {
        document.getElementById(`favoriteButtonContainer_${movieid}`).innerHTML = 'Lisätty suosikkeihin';
        const data = {
            token: jwtToken.value,
            id: movieid,
            movie: original_title,
            poster: poster,
        };
        console.log(data);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };

        // Lähetetään pyyntö backendiin
        fetch('http://localhost:3001/favorites/addFavorite/', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('Suosikin lisäys onnistui:', data);
            })
            .catch(error => console.error('Virhe lisättäessä suosikkiin:', error));
    };

    return (
        <div>
            {showReviewForm ? (
                <ReviewForm />
            ) : (
                <div>
                <form onSubmit={handleSearch} className="search-container">
                    <div className="search-input-container">
                        <input
                            type="text"
                            id="searchField"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-button">Search</button>
                    </div>
                    <div className="dropdowns-container">
                        <select
                            value={selectedGenre}
                            id='Genredropdown'
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="searchDropdown"
                        >
                            <option value='0'>Valitse Genre</option>
                            {genres.map((genre)=>
                            <option key={genre.id} value={genre.id}>{genre.name}</option>
                        )}
                            
                        </select>
                        <select

                            id='yearDropdown'
                            className="searchDropdown"
                        >
                            <option value='0'>Valitse julkaisuvuosi</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                            <option value="2014">2014</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                            <option value="2011">2011</option>
                            <option value="2010">2010</option>
                            <option value="2009">2009</option>
                            <option value="2008">2008</option>
                            <option value="2007">2007</option>
                            <option value="2006">2006</option>
                            <option value="2005">2005</option>
                            <option value="2004">2004</option>
                            <option value="2003">2003</option>
                            <option value="2002">2002</option>
                            <option value="2001">2001</option>
                            <option value="2000">2000</option>
                            <option value="1999">1999</option>
                            <option value="1998">1998</option>
                            <option value="1997">1997</option>
                            <option value="1996">1996</option>
                            <option value="1995">1995</option>
                            <option value="1994">1994</option>
                            <option value="1993">1993</option>
                            <option value="1992">1992</option>
                            <option value="1991">1991</option>
                            <option value="1990">1990</option>
                            <option value="1989">1989</option>
                            <option value="1988">1988</option>
                            <option value="1987">1987</option>
                            <option value="1986">1986</option>
                            <option value="1985">1985</option>
                            <option value="1984">1984</option>
                            <option value="1983">1983</option>
                            <option value="1982">1982</option>
                            <option value="1981">1981</option>
                            <option value="1980">1980</option>
                            <option value="1979">1979</option>
                            <option value="1978">1978</option>
                            <option value="1977">1977</option>
                            <option value="1976">1976</option>
                            <option value="1975">1975</option>
                            <option value="1974">1974</option>
                            <option value="1973">1973</option>
                            <option value="1972">1972</option>
                            <option value="1971">1971</option>
                            <option value="1970">1970</option>
                        </select>
                    </div>
                </form>
                <div className="movie-genre" id='movie-genre'>
                </div>
                <div className="movie-grid" id='movie-grid'>
                    {movies.map((movie) =>
                        <div className='movie-item' key={movie.id} style={(movie.genre_ids.indexOf(parseInt(selectedGenre)) !== -1 || parseInt(selectedGenre) == 0) ? ({display: 'block'}) : ({display: 'none'})}>
                            
                            {movie.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={`Elokuvan ${movie.original_title} kuva`} key={`poster${movie.id}`} />
                            ) : (
                                <img src='/img/noposter.jpg' alt={`Elokuvan ${movie.original_title} kuva`} key={`poster${movie.id}`} />
                            )}
                            <div className='movieTitle' key={`Title_${movie.id}`}>{movie.original_title}</div>
                            {jwtToken.value.length > 1 &&
                                <div className='searchExtraButtons'>
                                    <div className='addToGroupListContainer'>
                                        <button className='addToGroupListSelectGroupsButton searchPageButton' onClick={() => selectGroup(movie.id)}>Lisää ryhmän listalle</button>
                                        {selectedMovieToGroupList == movie.id &&
                                            <div className='addToGroupList_SelectGroupContainer' id={`addToGroupList_SelectGroupContainer_${movie.id}`}>
                                                {groups.map((group) =>
                                                    <button className='addToGroupListButton searchPageButton' onClick={() => addToGroupMovieList(group.id, movie.original_title, movie.id, `https://image.tmdb.org/t/p/original${movie.poster_path}`)}>{group.name}</button>
                                                )}
                                            </div>
                                        }

                                    </div>
                                    <div className='addReviewContainer'>
                                        <button className='addReviewButton searchPageButton' onClick={() => addReview(movie.id, movie.original_title, `https://image.tmdb.org/t/p/original${movie.poster_path}`)}>Lisää arvostelu</button>
                                    </div>
                                </div>
                            }
                            {jwtToken.value.length > 1 &&
                                <div id={`favoriteButtonContainer_${movie.id}`}>
                                    <button className="addToFavoritesButton searchPageButton" onClick={() => addToFavorites(movie.id, movie.original_title, `https://image.tmdb.org/t/p/original${movie.poster_path}`)}>Lisää suosikiksi</button>
                                </div>
                            }
                        </div>                      
                    )}
                </div>
            </div>
            )}
        </div>
    );
}