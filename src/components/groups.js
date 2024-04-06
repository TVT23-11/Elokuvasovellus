import React, { useState, useEffect } from 'react';
import '../App.css';

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/groups') 
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error fetching groups:', error));
      
  }, []);

  return (
    <div className="groups-container"> {/* Lisää luokka */}

      {groups.map(group => (
        <div className="group" key={group.idgroup}> {/* Lisää luokka */}
          <div>
            <strong className="group-name">{group.name}</strong> {/* Lisää luokka */}
          </div>
          <div className="group-description">{group.description}</div> {/* Lisää luokka */}
        </div> 
      ))}
    </div>
  );
}