import React, { useState } from 'react';

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  // Staattinen lista mainoksista tilalle, kunnes saadaan API-avain
  const staticAds = ["Mainostaulukko"];

  //Tähän tehdään API-kutsu mainosten hakemiseksi


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    console.log("Haku:", searchTerm);
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

      {/* Mainostila */}
      <div className="ad-container">
        <h2>Mainokset</h2>
        <ul>
          {staticAds.map((ad, index) => (
            <li key={index}>{ad}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Main;