import React from 'react';
import logo from './logo.svg';
import './App.css';
import PublicRoute from './Routes/PublicRoute';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Outlet />
  );
}

export default App;
