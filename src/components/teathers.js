import React, { useState, useEffect } from 'react';

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0');
const year = today.getFullYear();
const formattedDate = `${day}-${month}-${year}`;

function Theaters() {
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    const finnkinoHaku = async () => {
      try {
        const theatersUrl = `https://www.finnkino.fi/xml/TheatreAreas/`;
        const response = await fetch(theatersUrl);
        const data = await response.text();
        const parser = new window.DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');
        const theaterNodes = xmlData.querySelectorAll('TheatreArea');
        const theaterList = Array.from(theaterNodes).map(theater => ({
          id: theater.querySelector('ID').textContent,
          name: theater.querySelector('Name').textContent
        }))
        .filter(theater => theater.id !== '1014'); // Otan pois teatterin 1014 (pk seutu) koska sielä näkyy jo kaikki PK-seudun teatterit
        setTheaters(theaterList);
      } catch (error) {
        console.error('Ongelma ilmeni:', error);
      }
    };

    finnkinoHaku();
  }, []); // varmistaa että efekti suoritetaan vain kerran komponentin asennuksen yhteydessä

  return (
    <div>
      <h1>Kaikki teatterit</h1>
      <ul>
        {theaters.map(theater => (
          <li key={theater.id}>{theater.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Theaters;
