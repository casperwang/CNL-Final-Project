import { signInWithRedirect, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { TailSpin } from "react-loading-icons";

import { auth, provider } from "../auth";

import "./header.css";

function Header() {
  const [user, loading, error] = useAuthState(auth);
  // token is at user?.accessToken
  // user?.displayName
  // user?.email

  if (error) return <div>Something wrong in auth.</div>;

  // if (loading) return <div>Loading</div>;
  // if (!user) return <div>Not logged in yet</div>;

  // console.log(user);

  const login = async () => await signInWithRedirect(auth, provider);
  const logout = async () => await signOut(auth);
  const avatarStyle = {
    borderRadius: "50%",
    width: 25,
    height: 25,
    display: "block",
  };

  const className = "button button-green";

  return (
    <header>
      <div className="login-bar">
        <h1 className="website-title">CNL Team 8 Final Project - Host Page</h1>
        <div className="login-controls">
          {
            loading
              ? <TailSpin style={avatarStyle} />
              : (user && <img style={avatarStyle} src={user.photoURL} alt="user" />)
          }
          {
            !loading && !user
              ? <button onClick={login} className={className}>Login</button>
              : <button onClick={logout} className={className}>Logout</button>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
