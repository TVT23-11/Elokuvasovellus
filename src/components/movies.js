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
    </div>
  );
}

export default Movies;
