import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtToken } from './authSignals';

const showNewGroupForm = () => {
  document.getElementById('newGroupFormContainer').style.display = 'block';
};
const closeNewGroupForm = () => {
  document.getElementById('newGroupFormContainer').style.display = 'none';
  document.getElementById('newGroupForm_groupName').value = '';
  document.getElementById('newGroupForm_groupDescription').value = '';
};

const AcceptUserToGroup = (user, group) => {

  const data = {
    user: user,
    group: group
  };

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  };
  console.log(requestOptions);
  fetch('http://localhost:3001/groups/acceptToGroup/', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data.message);
      if(data.message == 'success'){
        console.log('Käyttäjä hyväksytty ryhmään');
        document.getElementById('acceptMember_'+user+'-'+group).innerHTML = '<div class="acceptedToGroup">Hyväksytty</div>';
      }
    })
    .catch(error => {
      console.error(error);
    });
};

function isLoggedIn() {
  if (jwtToken.value == '') {
    return false;
  }
  return true;
};

const AddNewGroup = () => {
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

function PendingJoinRequests() {
  const [joinRequests, setJoinRequests] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/groups/joinRequests/' + jwtToken.value)
      .then(response => response.json())
      .then(data => setJoinRequests(data))
      .catch(error => console.error('Error fetching groups:', error));

  }, []);

  let requestArray = new Array();
  let currentGroup = '';
  //console.log(data);
  if (joinRequests != '') {
    let data = joinRequests;
    for (let i = 0; i < data.length; i++) {

      if (requestArray.length == 0) {
        requestArray.push({ key: i, groupname: data[i].groupname, idgroup: data[i].idgroup, users: [{ username: data[i].username, iduser: data[i].iduser }] });
        currentGroup = data[i].groupname;
      } else if (data[i].groupname != currentGroup) {
        currentGroup = data[i].groupname;
        requestArray.push({ key: i, groupname: data[i].groupname, idgroup: data[i].idgroup, users: [{ username: data[i].username, iduser: data[i].iduser }] });
      } else {
        requestArray[requestArray.length - 1].users.push({ username: data[i].username, iduser: data[i].iduser });
      }

    }
    console.log(requestArray);
    return (
      <div className='joinRequestContainer'><p>Hyväksy käyttäjiä ryhmiisi:</p>
        {requestArray.map((group) =>
          
          <div className='acceptRequestsGroup' key={group.key}><div className='acceptJoinRequestGroupName'>{group.groupname}</div>

            {group.users.map((user) =>
              <div className='acceptUserToGroup'>
                <p>{user.username}</p><div id={`acceptMember_${+user.iduser+'-'+group.idgroup}`}><button className='acceptUserToGroup' onClick={() => AcceptUserToGroup(user.iduser, group.idgroup)}>Hyväksy</button></div>
              </div>
            )}

          </div>
        )}
      </div>
    );
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

          <div className="newGroupFormContainer" id="newGroupFormContainer" style={{ display: 'none' }}>
            <div className='newGroupFormHeader'>Anna uuden ryhmän tiedot:</div>
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
            <button id='closeNewGroupForm' className='closeButton' onClick={closeNewGroupForm}>Sulje lomake</button>
          </div>
          <PendingJoinRequests />
        </div>
      )}
    </div>
  )
}
