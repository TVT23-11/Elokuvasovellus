import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function NavigationBar() {
    return (
        <div>
        <div className="navigation-bar">
            <div className="nav-links">
                <Link to={"/"}>Etusivu</Link>
                <Link to={"/movies"}>Elokuvat</Link>
                <Link to={"/teathers"}>Teatterit</Link>
                <Link to={"/groups"}>Ryhmät</Link>
                <Link to={"/reviews"}>Arvostelut</Link>
                <Link to={"/favourites"}>Suosikit</Link>
                <Link to={"/login"}>Kirjaudu Sisään</Link>
            </div>
        </div>
        <div className="dropdown">
            <button className="dropbtn">"dropdownvalikko"</button>
            <div className="dropdown-content">
                <Link to="/profile">Profiili</Link>
                <Link to="/groupmanagement">Ryhmien hallinta</Link>
                <Link to="/logout">Kirjaudu ulos</Link>
            </div>
        </div>
    </div>
);
}