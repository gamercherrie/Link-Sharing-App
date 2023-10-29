import React from 'react';
import { Login, CreateAccount } from './Pages';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.sass';

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<CreateAccount/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App;