import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = ({ toggle }: { toggle: () => void }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      history.push("/login");
    } else {
      history.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    history.push("/login");
  };

  return (
    <nav className='navbar navbar-dark border-bottom'>
      <div className='container-fluid'>

        <button
          className='navbar-toggler d-block p-0'
          onClick={toggle}
        >
          <div className='d-block align-items-center justify-content-center'>
            <i className="bi bi-list text-black" style={{ fontSize: 35 }}></i>
          </div>
        </button>

        <Link className='fw-semibold' to="/"
          style={{ fontSize: '24px', textDecoration: 'none', color: 'inherit' }}>
          Note4U
        </Link>
        
        {isLoggedIn ? (
          <div className="dropdown">
            <button
              className="btn bg-opacity-100 border-0 p-0"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person-circle" style={{fontSize:30}}></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item">
                  Profile
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <button className='btn btn-primary' onClick={() => history.push("/login")}>
            Sign in
          </button>
        )}

      </div>
    </nav>
  );
};