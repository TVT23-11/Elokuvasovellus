import React, { useState, useEffect } from 'react';

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('');
    const [setError] = useState(null);
    const [selectedGenre, setSelectedGenre] = useState('');
 

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
                console.log(data);
                console.log('genret tuleeko', json.genres[0]);

                let Genredropdown = document.getElementById('Genredropdown');
                json.genres.forEach(function (genre) {
                    let newGenre = document.createElement('option');
                    newGenre.value = genre.id;
                    newGenre.innerHTML = genre.name;
                    Genredropdown.append(newGenre);

                });
            })
            .catch(error => {
                console.error('Genren Hakuvirhe:', error.message);
            });
    }, []);



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

        fetch('http://localhost:3001/TMDB/elokuvahaku?hakusana=' + hakusana + vuosi)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fetch-virhe: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                let json = JSON.parse(data);
                let moviegrid = document.getElementById('movie-grid');
                console.log(document.getElementById('Genredropdown').value);
                moviegrid.innerHTML = '';
                json.results.forEach(function (movie) {
                   
                    let genreid = parseInt(document.getElementById('Genredropdown').value);
                    if (movie.genre_ids.indexOf(genreid) > -1 || genreid == 0) {
                        let movieElement = '<div class="movie-item" >';
                        movieElement += `<img src='https://image.tmdb.org/t/p/original${movie.poster_path}' alt='Poster for ${movie.original_title}' />`;
                        movieElement += `<div>${movie.original_title}</div>`;
                        movieElement += `</div>`;
                        moviegrid.innerHTML += movieElement;
                    }

                });
            })
            .catch(error => {
                setError('Hakuvirhe: ' + error.message);
            });
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="search-container">
                <input
                    type="text"
                    id="searchField"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <select
                    value={selectedGenre}
                    id='Genredropdown'
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="searchDropdown"
                >
                    <option value='0'>Valitse Genre</option>
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
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="movie-grid" id='movie-grid'>
            </div>
            <div className="movie-genre" id='movie-genre'>
            </div>

        </div>
    );
}