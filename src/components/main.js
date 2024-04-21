import React, { useState, useEffect } from 'react';

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ads, setAds] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/News/');
        const data = await response.text();
        const parser = new window.DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');
        const adNodes = xmlData.querySelectorAll('NewsArticle');
        const adsData = Array.from(adNodes).map(adNode => ({
          title: adNode.querySelector('Title')?.textContent || '',
          lead: adNode.querySelector('HTMLLead')?.textContent || '',
          imageUrl: adNode.querySelector('ImageURL')?.textContent || '',
        }));
        console.log('Mainokset:', adsData);
        setAds(adsData);
      } catch (error) {
        console.error('Virhe mainosten haussa:', error);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % ads.length);
    }, 5000); // Vaihda mainosta joka 5 sekunti
    return () => clearInterval(intervalId); // Puhdista intervali komponentin purkamisen yhteydessä
  }, [ads]); // Riippuvuus ads-taulukosta

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

      <div className="ad-container">
        <div className="ad-item">
          {ads.length > 0 && (
            <div className="ad-content">
              <img className="ad-image" src={ads[index].imageUrl} alt={ads[index].title} />
              <p>{ads[index].title}</p>
              <p>{ads[index].lead}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;