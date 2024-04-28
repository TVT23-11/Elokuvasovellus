import React, { useState, useEffect } from 'react';

function Main() {
  const [ads, setAds] = useState([]);
  const [events, setEvents] = useState([]);
  const [adIndex, setAdIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);

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
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/Events/');
        const data = await response.text();
        const parser = new window.DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');
        const eventNodes = xmlData.querySelectorAll('Event');
        const eventsData = Array.from(eventNodes).map(eventNode => ({

          title: eventNode.querySelector('Title')?.textContent || '',
          synopsis: eventNode.querySelector('ShortSynopsis')?.textContent || '',
          imageUrl: eventNode.querySelector('EventLargeImagePortrait')?.textContent || '',
        }));
        console.log('Tapahtumat:', eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Virhe tapahtumien haussa:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const adIntervalId = setInterval(() => {
      setAdIndex(prevIndex => (prevIndex + 1) % ads.length);
    }, 7000); // Vaihda mainosta joka 5 sekunti
    const eventIntervalId = setInterval(() => {
      setEventIndex(prevIndex => (prevIndex + 1) % events.length);
    }, 7000); 
    return () => {
      clearInterval(adIntervalId);
      clearInterval(eventIntervalId);
    };
  }, [ads, events]);

  return (
    <div>
      <div className="welcome-message-container">
        <h2 className="welcome-heading">Tervetuloa movie pro palveluun</h2>
        <div className="welcome-content">
          <p>Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          Täältä löydät kaikki tarvitsemasi elokuvatiedot ja paljon muuta!
          </p>
        </div>
      </div>

      <div className="ad-container">
        <h2 className= "ad-heading"> Ajankohtaista:</h2>
        <div className="ad-item">
          {ads.length > 0 && (
            <div className="ad-content">
              <img className="ad-image" src={ads[adIndex].imageUrl} alt={ads[adIndex].title} />
              <p>{ads[adIndex].title}</p>
              <p>{ads[adIndex].lead}</p>
            </div>
          )}
        </div>
      </div>

      <div className="event-container">
        <h2 className="event-heading"> Uutta nyt:</h2>
        <div className="event-item">
          {events.length > 0 && (
            <div className="event-content">
              <img className="event-image" src={events[eventIndex].imageUrl} alt={events[eventIndex].title} />
              <p>{events[eventIndex].title}</p>
              <p>{events[eventIndex].synopsis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;