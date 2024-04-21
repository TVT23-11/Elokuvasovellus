import React from 'react'

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

class RegisterButton extends React.Component {
    // This syntax ensures `this` is bound within handleClick.
    handleClick = () => {
      let username = document.getElementById("registerFormUsername").value;
      let email = document.getElementById("registerFormEmail").value;
      let password = document.getElementById("registerFormPassword").value;
      let password2 = document.getElementById("registerFormPassword2").value;

      if(username.length < 3){
        console.log("Käyttäjätunnus ei kelpaa");
        document.getElementById('registerFormUserStatus').innerHTML = '&#10007; Käyttäjätunnus ei kelpaa';
      } 
      else if(!validateEmail(email)){
        console.log("sähköposti ei kelpaa");
        document.getElementById('registerFormEmailStatus').innerHTML = '&#10007; Sähköposti ei kelpaa';
      }
      else if(password !== password2){
        console.log("Salasanat eivät täsmää");
        document.getElementById('registerFormPasswordStatus').innerHTML = '&#10007; Salasanat eivät täsmää';
      }
      else if(password.length < 1) {
        console.log('Salasana ei kelpaa');
        document.getElementById('registerFormPasswordStatus').innerHTML = '&#10007; Salasana ei kelpaa';
      }
      else{
        const data = {
            username: username,
            email: email,
            password: password
        };
        const requestOptions = {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(data)
        };
        fetch('http://localhost:3001/user/register', requestOptions)
            .then(response => response.json())
            .then(data => {
              //console.log(data);
              if(data === 'ok'){
                document.getElementById('registerFormInfo').innerHTML = "<h2>Käyttäjätili luotiin onnistuneesti. Voit nyt kirjautua sillä sisään</h2>";

                // Tyhjennetään lomake
                document.getElementById('registerFormUserStatus').innerHTML = '';
                document.getElementById('registerFormEmailStatus').innerHTML = '';
                document.getElementById('registerFormPasswordStatus').innerHTML = '';
                
                document.getElementById('registerFormUsername').value = '';
                document.getElementById('registerFormEmail').value = '';
                document.getElementById('registerFormPassword').value = '';
                document.getElementById('registerFormPassword2').value = '';
              }
              else{
                console.log(data);
                document.getElementById('registerFormInfo').innerHTML = "<p>Tarkista lomakkeen tiedot</p>";
              }
            })
            .catch(error => {
              document.getElementById('registerFormInfo').innerHTML = "<p>Tarkista lomakkeen tiedot</p>";
                console.error(error);
            });
      }
      
    };
    render() {
      return (
        <button className="register-button" onClick={this.handleClick}>
          Luo tili
        </button>
      );
    }
  }

const checkUsername = () => {
  let username = document.getElementById('registerFormUsername').value;
  fetch('http://localhost:3001/user/checkUsername?username=' + username)
            .then(response => response.json())
            .then(data => {
              //console.log(data);
              if(data === 'available'){
                document.getElementById('registerFormUserStatus').innerHTML = '&#10003';
              } else if (data === 'not available'){
                document.getElementById('registerFormUserStatus').innerHTML = '&#10007; Tämä käyttäjätunnus on jo olemassa';
              }
              else{
                console.log(data);
              }
            })
            .catch(error => {
                console.error(error);
            });
};

const checkEmail = () => {
  let email = document.getElementById('registerFormEmail').value;
  if(!validateEmail(email)){
    document.getElementById('registerFormEmailStatus').innerHTML = '&#10007; Anna oikea sähköpostiosoite';
  }
  else{
    fetch('http://localhost:3001/user/checkEmail?email=' + email)
            .then(response => response.json())
            .then(data => {
              //console.log(data);
              if(data === 'available'){
                document.getElementById('registerFormEmailStatus').innerHTML = '&#10003';
              } else if (data === 'not available'){
                document.getElementById('registerFormEmailStatus').innerHTML = '&#10007; Tällä sähköpostilla on jo luotu tunnus';
              }
              else{
                console.log(data);
              }
            })
            .catch(error => {
                console.error(error);
            });
  }
};

const checkPassword = () => {
  let password = document.getElementById("registerFormPassword").value;
  let password2 = document.getElementById("registerFormPassword2").value;

  if(password !== password2){
    document.getElementById('registerFormPasswordStatus').innerHTML = '&#10007; Salasanat eivät täsmää';
  } else {
    document.getElementById('registerFormPasswordStatus').innerHTML = '&#10003';
  }
};

export default function () {
  return (
    <div>
      
      <div id='registerFormInfo'></div>
      <div className="registerFormContainer">
      <h2 className="loginTitle">Tervetuloa! Luo käyttäjätunnuksesi.</h2>
        <table className="registerFormTable">
          <tbody>
            <tr>
              <td>Käyttäjätunnus:</td>
              <td><input type="text" id="registerFormUsername" onBlur={checkUsername} /><span id="registerFormUserStatus" className='validationStatus'></span></td>
            </tr>
            <tr>
              <td>Sähköposti:</td>
              <td><input type="text" id="registerFormEmail" onBlur={checkEmail}/><span id="registerFormEmailStatus" className='validationStatus'></span></td>
            </tr>
            <tr>
              <td>Salasana:</td>
              <td><input type="password" id="registerFormPassword" /><span id="registerFormPasswordStatus" className='validationStatus'></span></td>
            </tr>
            <tr>
              <td>Salasana uudelleen:</td>
              <td><input type="password" id="registerFormPassword2" onBlur={checkPassword}/></td>
            </tr>
            <tr>
              <td></td>
              <td>{<RegisterButton  className="register-button" />}  </td> 
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}