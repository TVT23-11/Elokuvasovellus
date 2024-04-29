import React from 'react'
import { Link, useHistory } from 'react-router-dom' 
import { jwtToken } from './authSignals';


const kirjauduSisaan = () => {
    let username = document.getElementById('loginFormUsername').value;
    let password = document.getElementById('loginFormPassword').value;
    

    const data = {
        username: username,
        password: password
    };
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(data)
    };
    console.log(requestOptions);
    fetch('http://localhost:3001/user/login', requestOptions)
        .then(response => response.json())
        .then(data => {
            if(data.error == 'wrong password' && data.error != 'user not found'){
                document.getElementById('loginFormInfo').innerHTML = '<p>Virheellinen käyttäjätunnus tai salasana</p>';
            }
            else{
                jwtToken.value = data.jwtToken; //Asetetaan jwt token signalin kautta session storageen
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error(error);
        });
};

export default function login() {
    return (
        <div className="login-container">
              
            <h2 className="loginTitle">Tervetuloa! Kirjaudu sisään tunnuksillasi.</h2>
            <div id='loginFormInfo'></div>
            <table>
                <tbody>
                    <tr>
                        <td><label>Käyttäjätunnus:</label></td>
                        <td><input type='text' id='loginFormUsername' className='login-input' /></td>
                    </tr>
                    <tr>
                        <td><label>Salasana:</label></td>
                        <td><input type='password' id='loginFormPassword' className='login-input' /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button id='loginButton' onClick={kirjauduSisaan} className='loginPage-button'>Kirjaudu sisään</button></td>
                    </tr>
                </tbody>
            </table>
            <Link to={"../register"} className='link'>
                Luo uusi käyttäjätunnus
            </Link>
            
        </div>
    )
}
