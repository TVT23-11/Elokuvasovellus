import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom' ;
import { jwtToken } from './authSignals';

const showNewGroupForm = () => {
  document.getElementById('newGroupFormContainer').style.display = 'block';
};

function isLoggedIn() {
  if(jwtToken.value == ''){
    return false;
  }
  return true;
};

const AddNewGroup = () => {

  console.log("Ryhmän nimi: " + document.getElementById('newGroupForm_groupName').value);
  console.log("Ryhmän kuvaus: " + document.getElementById('newGroupForm_groupDescription').value);

  let name = document.getElementById('newGroupForm_groupName').value;
  let description = document.getElementById('newGroupForm_groupDescription').value
  if (name == '') {
    document.getElementById('newGroupForm_groupName_status').innerHTML = '&#10007; Ryhmälle täyty antaa nimi';
  } else {
    const data = {
      name: name,
      description: description,
      token: jwtToken.value
    };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    };

    fetch('http://localhost:3001/groups/', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          document.getElementById('newGroupForm_infoLine').innerHTML = data.error;
        } else {
          console.log(data.message);
          document.getElementById('newGroupForm_infoLine').innerHTML = 'Ryhmä luotiin onnistuneesti';

          //Tyhjennetään lomake
          document.getElementById('newGroupForm_groupName').value = '';
          document.getElementById('newGroupForm_groupDescription').value = '';

          document.getElementById('newGroupForm_groupName_status').innerHTML = '';
          document.getElementById('newGroupForm_groupDescription_status').innerHTML = '';
        }

      });
  }

};

export default function gropupmanagement() {

  return (
    <div>
      
      {!isLoggedIn() ? (
           <p>Tämä sivu näkyy vain kirjautuneille käyttäjille. <Link to="/login" className="login-button">Kirjaudu Sisään</Link></p>
        ) : (
        <div className='groupManagementContainer'>
          <button className='formButton' onClick={showNewGroupForm}>Luo uusi ryhmä</button>
          <div className="newGroupFormContainer" id="newGroupFormContainer" style={{display:'none'}}>
          <h3>Syötä ryhmän tiedot:</h3>
            <div id='newGroupForm_infoLine'>&nbsp;</div>
            <table>
              <tbody>
                <tr>
                  <td>Ryhmän nimi:</td>
                  <td><input type='text' id='newGroupForm_groupName' /><span id="newGroupForm_groupName_status" className='validationStatus'></span></td>
                </tr>
                <tr>
                  <td>Ryhmän kuvaus:</td>
                  <td><textarea id='newGroupForm_groupDescription' rows={7} cols={35}></textarea><span id="newGroupForm_groupDescription_status" className='validationStatus'></span></td>
                </tr>
                <tr>
                  <td></td>
                  <td><button id='newGroupForm_addNewGroup' onClick={AddNewGroup}>Luo uusi ryhmä</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
