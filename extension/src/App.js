import './App.css';
import { useAuth } from './auth';

function App() {
  const { user, signIn } = useAuth();
  return (
    <div className="App">
      <h1>Hello from React Chrome Extension!</h1>
      <button onClick={() => {
        if(!user){
          signIn();
        }
      }}>Login with Google</button>
    </div>
  );
}

export default App;
