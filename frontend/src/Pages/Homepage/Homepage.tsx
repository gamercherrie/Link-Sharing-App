import React from 'react'
import { useAuth } from '../../AuthProvider'
import './Homepage.sass'

const Homepage = () => {
    const {logout : logoutAuthfn} = useAuth();
    const handleLogout = async() => {
        await logoutAuthfn();
    }
  return (
    <div>
        Homepage
        <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Homepage