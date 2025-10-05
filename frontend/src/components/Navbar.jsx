import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();

  return (
    <nav className="bg-blue-600 text-white dark:bg-gray-900 dark:text-gray-200 p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/" className="font-bold">BookReview</Link>
        <Link to="/">Home</Link>
        {user && <Link to="/add-book">Add Book</Link>}
        {user && <Link to="/profile">Profile</Link>}
      </div>
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setDark(!dark)}
          className="bg-gray-200 text-black px-2 py-1 rounded dark:bg-gray-700 dark:text-white"
        >
          {dark ? "🌞 Light" : "🌙 Dark"}
        </button>
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
