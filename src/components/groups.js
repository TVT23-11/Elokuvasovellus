import React, { useState, useEffect } from 'react';
import { jwtToken } from './authSignals';
import '../App.css';



export default function Groups() {

  function GroupList() {

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
                <button className='button' id={`requestGroupMembership_${group.idgroup}`} onClick={() => requestGroupMembership(group.idgroup)}>Lähetä liittymispyyntö</button>
              ) : (
                group.isaccepted === true ? (
                  //<span className='groupMembershipStatus'>Olet ryhmän jäsen</span>
                  <button className='button' id='' onClick={() => setView(group.idgroup)}>Avaa ryhmän sivu</button>
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

function GroupPage(){
  const [isAdmin, setIsAdmin] = useState([]);
  const [user, setUser] = useState([]);
  const [groupId, setGroupId] = useState([]);
  const [groupName, setGroupName] = useState([]);
  const [groupDescription, setGroupDescription] = useState([]);
  const [groupMovieList, setGroupMovieList] = useState([]);
  const [groupShowList, setGroupShowList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/groups/groupDetails/${view}/${jwtToken.value}`)
      .then(response => response.json())
      .then((data) => {
        setIsAdmin(data.admin);
        setUser(data.user);
        setGroupId(data.id);
        setGroupName(data.groupname);
        setGroupDescription(data.description);
        setGroupMovieList(data.groupMovieList);
        setGroupShowList(data.groupShowList);
        setGroupMembers(data.groupMembers);
      })
      .catch(error => console.error('Error fetching groups:', error));

  }, []);

  const removeUser = (user, group) => {

    const requestOptions = {
      method: 'delete',
      headers: { 'Content-type': 'application/json' }
    };
    console.log(requestOptions);
    fetch(`http://localhost:3001/groups/denyRequestToJoin/${user}/${group}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        if(data.message == 'success'){
          console.log('Käyttäjä poistettu ryhmästä');
          document.getElementById('groupMember_'+user).innerHTML = '<div class="acceptedToGroup">Hylätty</div>';
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return(
    <div>
      Tämä on ryhmän {view} oma sivu.
      <button className='button backToGroupsListButton' onClick={() => setView(0)}>Siirry takaisin ryhmä-listaan</button>
      <div className='groupPageContainer'>
        <div className='groupPageGroupName' key={groupName}>{groupName}</div>
        <div className='groupPageGroupDescription' key={`description${groupId}`}>{groupDescription}</div>
        <div className='groupMovieListContainer'>
          <div className='groupMovieListHeading'>Ryhmän elokuvalista:</div>
          {groupMovieList.length == 0 ? (
            <div>Lista on tyhjä</div>
          ) : (
            (groupMovieList.map(movie =>
              <div className='groupMovieListItem' key={`movie${movie.id}`}>{movie.name}</div>
            ))
          )}

        </div>
        <div className='groupShowListContainer'>
          <div className='groupShowListHeading'>Ryhmän näytöslista:</div>
          {groupShowList.length == 0 ? (
            <div>Lista on tyhjä</div>
          ) : (
            (groupShowList.map((show) =>
              <div className='groupShowListItem' key={`show${show.id}`}>
                <div className='groupShowListMovie'>{show.moviename}</div>
                <div className='groupShowListTheater'>{show.theater}</div>
                <div className='groupShowListShowtime'>{show.showtime}</div>
                <img src={show.poster} alt={`Elokuvan ${show.moviename} kuva`} />
              </div>
            ))
          )}
        </div>
        <div className='groupMembersContainer'>
        <div className='groupMemberListHeading'>Ryhmän jäsenet:</div>
          {groupMembers.map((member) => (
            <div className='groupMemberListItem' key={member.username} id={`groupMember_${member.id}`}> {member.username}
            {(isAdmin == 1 && user != member.id) && <button className='button removeFromGroup' onClick={() => removeUser(member.id, groupId)}>Poista jäsen</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const [view, setView] = useState([0]);

  return(
    <div>
    {view < 1 ? (
      <GroupList />
    ) : (
      <GroupPage />
    ) }
    </div>
  );
  
}