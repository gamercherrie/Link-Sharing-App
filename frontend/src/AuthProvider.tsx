import React, { useState, createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string>('');

    const location = useLocation();

    const login = async(email:string, password:string): Promise <void> => {
      try{
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        console.log('response?', response);
        
        if(response.ok){
          console.log("User has logged in");
          setIsAuthenticated(true);
        } else {
          const result = await response.json();
          setAuthError(result.message || 'Failed to log in');
          setIsAuthenticated(false)
        }
      }catch(error){
        console.error("Error during login:", error);
        setAuthError('Login Request failed');
        setIsAuthenticated(false);
      }
    }

    //Function to handle logout
    const logout = async() : Promise <void> => {
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //make sure token doesnt renew?
      //clear auth state
      setIsAuthenticated(false);
    }

    useEffect(() => {
      if(location.pathname === '/login' || location.pathname ==='/' || location.pathname === '/logout' || location.pathname === '/register') return;
      (async function(){
        try{
          const response = await fetch('/validate-token', {
            credentials: 'include',
          })
          console.log('what is the response', response);

          if(response.ok){
            setIsAuthenticated(true);
          }else{
            setIsAuthenticated(false)
          }
        } catch(error) {
          console.error("Error during auth check:", error);
          setIsAuthenticated(false);
        }
      })();      
    }, [location]);

    return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout, authError }}>
          {children}
      </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext) as AuthContextType;