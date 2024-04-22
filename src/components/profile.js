import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAccountButton = () => {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    const token = sessionStorage.getItem('token'); //Haetaan tokeni sessionStoragesta. 
    
    // Tehdään DELETE-pyyntö käyttäen tokenia
    fetch('http://localhost:3001/user/?id=' + token, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.ok) {
          console.log('Käyttäjätili poistettu onnistuneesti');
          // Tyhjennetään token sessionStoragesta
          sessionStorage.setItem('token', '');
          navigate('/login');
        } else {
          console.error('Käyttäjätilin poistaminen epäonnistui:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Virhe käyttäjätilin poistamisessa:', error);
      });
  };

  return (
    <div>
      <button className="delete-account-button" onClick={handleDeleteAccount}>Poista käyttäjätili</button>
    </div>
  );
};

export default DeleteAccountButton;