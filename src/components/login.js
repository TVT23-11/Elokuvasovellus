import React from 'react'
import { Link } from 'react-router-dom' 

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
    fetch('http://localhost:3001/user/login', requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data == 'wrong password'){
                document.getElementById('loginFormInfo').innerHTML = '<p>Virheellinen käyttäjätunnus tai salasana</p>';
            }
        })
        .catch(error => {
            console.error(error);
        });
};

export default function login() {
    return (
        <div>
            <h1>Tähän tulee login välilehti</h1>
            <div id='loginFormInfo'></div>
            <table>
                <tbody>
                    <tr>
                        <td><label>Käyttäjätunnus:</label></td>
                        <td><input type='text' id='loginFormUsername' /></td>
                    </tr>
                    <tr>
                        <td><label>Salasana:</label></td>
                        <td><input type='password' id='loginFormPassword' /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><button id='loginButton' onClick={kirjauduSisaan}>Kirjaudu sisään</button></td>
                    </tr>
                </tbody>
            </table>
            <Link to={"../register"} className='link'>
                Luo uusi käyttäjätunnus
            </Link>
        </div>
    )
}
