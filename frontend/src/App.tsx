import React from 'react';
import { Login, CreateAccount, Homepage } from './Pages';
import { Route, Routes} from 'react-router-dom';
import { useAuth } from './AuthProvider'
import ProtectedRoute from './ProtectedRoute';
import './App.sass';

const App = () => {
  const { isAuthenticated } = useAuth();
  console.log('is authenticated?', isAuthenticated);

  return(   
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Homepage /> : <Login />} 
        />
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<CreateAccount/>}/>
        <Route path='/homepage' element={<ProtectedRoute path ='/homepage' element={<Homepage />} /> } />
      </Routes>
  )
}

export default App;