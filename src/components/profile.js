import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileManagement = () => {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('token');

    console.log('newEmail:', newEmail);

    try {
      const response = await fetch(`http://localhost:3001/user/changeEmail/?id=${token}&newEmail=${newEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        } 
      });

      if (response.ok) {
        console.log('Sähköpostiosoite vaihdettu onnistuneesti');
        setNewEmail(''); // Tyhjennä lomakekenttä
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Sähköpostin vaihtaminen epäonnistui');
      }
    } catch (error) {
      console.error('Virhe sähköpostin vaihtamisessa:', error);
      setErrorMessage('Virhe sähköpostin vaihtamisessa. Yritä uudelleen myöhemmin.');
    }
  };

  const handleDeleteAccount = () => {
    // Näytetään vahvistusikkuna ja tallennetaan tulos
    const confirmDelete = window.confirm('Oletko varma että haluat poistaa käyttäjän?');

    // Jos käyttäjä vahvistaa poiston
    if (confirmDelete) {
      const token = sessionStorage.getItem('token');

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
    }
  };

  return (
    <div className="profile-management">
      <div className="email-change-container">
        <h2>Vaihda sähköposti</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Uusi sähköpostiosoite"
            value={newEmail}
            onChange={handleEmailChange}
          />
          <button type="submit">Vaihda sähköposti</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
      <div className="account-container">
        <h2>Poista käyttäjätili</h2>
        <button className="delete-account-button" onClick={handleDeleteAccount}>Poista käyttäjätili</button>
      </div>
    </div>
  );
};

export default ProfileManagement;