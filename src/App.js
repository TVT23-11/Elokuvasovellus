import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Main from './components/main'; 
import NavigationBar from './components/nav';
import Movies from './components/movies';
import Teathers from './components/teathers';
import Groups from './components/groups';
import Reviews from './components/reviews';
import Favourites from './components/favourites';
import Login from './components/login';
import Logout from './components/logout';
import Profile from './components/profile';
import Groupmanagement from './components/groupmanagement';
import Register from './components/register';
import Search from './components/search';


//Haetaan tokeni jos käyttäjä on kirjautunut sisään
const isAuthenticated = () => {
  const token = sessionStorage.getItem('token');
  return !!token;
};

function App() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    setIsUserAuthenticated(isAuthenticated());
  }, [location.pathname]); // Tämä päivittää komponentin joka kerta kun isAuthenticated tila muuttuu

  console.log('isUserAuthenticated:', isUserAuthenticated); 

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/movies':
        return 'Elokuvat';
      case '/teathers':
        return 'Teatterit';
      case '/groups':
        return 'Ryhmät';
      case '/reviews':
        return 'Arvostelut';
      case '/favourites':
        return 'Suosikit';
      case '/login':
        return 'Kirjaudu Sisään';
      case '/logout':
        return 'Kirjaudu ulos';
      case '/profile':
        return 'Profiili';
      case '/groupmanagement':
        return 'Ryhmien hallinta';
      case '/register':
        return 'Luo tili';
      case '/search':
        return 'Elokuvat';
      default:
        return 'Etusivu';
    }
  };

  return (
    <div>
      <h1 className="page-title">{getPageTitle()}</h1>
      <NavigationBar key={isUserAuthenticated} isAuthenticated={isUserAuthenticated} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/teathers" element={<Teathers />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/favourites" element={<Favourites setIsAuthenticated={setIsUserAuthenticated} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsUserAuthenticated} />} />
          <Route path="/logout" element={<Logout setIsAuthenticated={setIsUserAuthenticated} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/groupmanagement" element={<Groupmanagement />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;