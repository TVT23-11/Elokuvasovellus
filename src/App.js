import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Main from './components/main'; 
import NavigationBar from './components/nav';
import Movies from './components/movies';
import Tearthers from './components/teathers';
import Groups from './components/groups';
import Reviews from './components/reviews';
import Favourites from './components/favourites';
import Login from './components/login';
import Logout from './components/logout';
import Profile from './components/profile';
import Groupmanagement from './components/groupmanagement';
import Register from './components/register';
import Search from './components/search';


function App() {
  const location = useLocation();
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
          return 'search';
      default:
        return 'Etusivu';
    }
  };

  return (
    <div>
      <h1 className="page-title">{getPageTitle()}</h1>
      <NavigationBar />
      <div className="content">
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/teathers' element={<Tearthers />} />
          <Route path='/groups' element={<Groups />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path='/favourites' element={<Favourites />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/groupmanagement' element={<Groupmanagement/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/search' element={<Search />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;