import React from 'react';
import { Route, Routes } from 'react-router-dom';
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


function App() {
  return (
<div>
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
        </Routes>
      </div>
    </div>
  );
}
export default App;