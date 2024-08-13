import './App.css';
import Login from './containers/Login/Login';
import ChatPage from './containers/ChatPage/ChatPage';
import { useState } from 'react';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      {isLoggedIn ? <ChatPage /> : <Login setIsLoggedIn={setIsLoggedIn} />}
    </>
  );
}

export default App;
