import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import './App.css';

function App() {
  const { keycloak, initialized } = useKeycloak();

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  const callProtected = async () => {
    try {
      const response = await axios.get('http://localhost:4000/protected', {
        headers: {
          Authorization: 'Bearer ' + keycloak.token
        }
      });
      alert(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error(err);
      alert('خطا در دریافت اطلاعات محافظت شده');
    }
  };

  if (!initialized) return <div>در حال بارگذاری...</div>;

  return (
    <div className="App" style={{ padding: '20px', textAlign: 'center' }}>
      {!keycloak.authenticated ? (
        <button onClick={login}>ورود با Keycloak</button>
      ) : (
        <>
          <p>سلام، {keycloak.tokenParsed?.preferred_username}</p>
          <button onClick={callProtected}>دریافت اطلاعات محافظت شده</button>
          <button onClick={logout} style={{ marginLeft: '10px' }}>خروج</button>
        </>
      )}
    </div>
  );
}

export default App;
