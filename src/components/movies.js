import React, { useState } from 'react';

function Movies() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Haku:", searchTerm);
    
  };

  const finnkinoHaku = () => {
    fetch('https://www.finnkino.fi/xml/Schedule/?area=1033&dt=02.04.2024')
    .then(response => response.text())
    .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    .then(data => processData(data));
  }

  const processData = (data) => {
    console.log(data);
  };

  return (
    <div>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Haku..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Hae</button>
        </form>
      </div>
      <button onClick={finnkinoHaku}>Finnkino haku</button>
    </div>
  );
}

export default Movies;
