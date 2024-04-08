import React from 'react'

class RegisterButton extends React.Component {
    // This syntax ensures `this` is bound within handleClick.
    handleClick = () => {
      let username = document.getElementById("registerFormUsername").value;
      let email = document.getElementById("registerFormEmail").value;
      let password = document.getElementById("registerFormPassword").value;
      let password2 = document.getElementById("registerFormPassword2").value;

      if(password !== password2){
        console.log("Salasanat eivät täsmää")
      }
      else{
        console.log(username + " " + email + " " + password);
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
            .then(data => console.log(data))
            .catch(error => {
                console.error(error);
            });
      }
      
    };
    render() {
      return (
        <button onClick={this.handleClick}>
          Luo tili
        </button>
      );
    }
  }

export default function () {
    return (
        <div>
            <h1>Käyttäjätilin luonti</h1>
            <div className="registerFormContainer">
                <table className="registerFormTable">
                    <tr>
                        <td>Käyttäjätunnus:</td>
                        <td><input type="text" id="registerFormUsername" /></td>
                    </tr>
                    <tr>
                        <td>Sähköposti:</td>
                        <td><input type="text" id="registerFormEmail" /></td>
                    </tr>
                    <tr>
                        <td>Salasana:</td>
                        <td><input type="password" id="registerFormPassword" /></td>
                    </tr>
                    <tr>
                        <td>Salasana uudelleen:</td>
                        <td><input type="password" id="registerFormPassword2" /></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>{<RegisterButton />}</td>
                    </tr>
                </table>
            </div>
            
        </div>
    )
}