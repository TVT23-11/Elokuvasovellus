import React, { useState, useEffect } from 'react';
import { jwtToken } from './authSignals';
import '../App.css';




export default function Groups() {

  const requestGroupMembership = (group) => {
    console.log(group);
    const groupMemberStatusElement = document.getElementById('groupMemberStatus_'+group);
    groupMemberStatusElement.innerHTML = '';
    groupMemberStatusElement.innerHTML = '<span className="groupMembershipStatus">Liittymispyyntö lähetetty</span>';

    const data = {
      token: jwtToken.value,
      group: group
    };
    console.log(data);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    };

    fetch('http://localhost:3001/groups/requestGroupMembership/', requestOptions)
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error fetching groups:', error));
  }

  const [groups, setGroups] = useState([]);
  let token = '';
  if(jwtToken.value.length > 1){
    token = jwtToken.value;
  }

  useEffect(() => {
    fetch('http://localhost:3001/groups/All/' + token)
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
          {jwtToken.value !== '' ? (
            <div id={`groupMemberStatus_${group.idgroup}`} className='groupMemberStatus'> 
            {group.ismember === '0' ? (
              <button className='button' id='requestGroupMembership' onClick={() => requestGroupMembership(group.idgroup)}>Lähetä liittymispyyntö</button>
            ) : (
              group.isaccepted === true ? (
                <span className='groupMembershipStatus'>Olet ryhmän jäsen</span>
              ) : (
                <span className='groupMembershipStatus'>Liittymispyyntö lähetetty</span>
              )
            )}
            </div>
          ) : (
          <span> </span>
          )
          
          }
        </div>
      ))}
    </div>
  );
}