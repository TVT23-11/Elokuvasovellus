import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function NavigationBar() {
    return (
        <div className="navigation-bar">
            <div>
                <Link to={"/"}><button>Etusivu</button></Link>
                <Link to={"/movies"}><button>Elokuvat</button></Link>
                <Link to={"/teathers"}><button>Teatterit</button></Link>
                <Link to={"/groups"}><button>Ryhmät</button></Link>
                <Link to={"/reviews"}><button>Arvostelut</button></Link>
                <Link to={"/favourites"}><button>Suosikit</button></Link>
                <Link to={"/login"}><button>Kirjaudu Sisään</button></Link>

                <div className="dropdown">
                    <button className="dropbtn">"dropdownvalikko"</button>
                    <div className="dropdown-content">
                        <Link to="/profile">Profiili</Link>
                        <Link to="/groupmanagement">Ryhmien hallinta</Link>
                        <Link to="/logout">Kirjaudu ulos</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}