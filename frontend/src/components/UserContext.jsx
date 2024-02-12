import { createContext, useState, useEffect } from 'react';
import jwtdecode from 'jwt-decode';
import { GetRefreshToken, TokensExist } from '../utils/TokenManager';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const reset = () => {
    setUser(null);
    setSelectedCourse(null);
    setLoaded(false);
  };
  //const set = (key, value) => setUser({...user, [key]: value});

  useEffect(() => {
    if (TokensExist()) {
      let token = jwtdecode(GetRefreshToken());
      setUser({
        id: token.user_id,
        ...token.sub,
      });
      setSelectedCourse(token.sub.courseId[0]);
    }

    setLoaded(true);
    return reset;
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoaded,
        selectedCourse,
        setUser,
        setLoaded,
        setSelectedCourse,
        reset,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
