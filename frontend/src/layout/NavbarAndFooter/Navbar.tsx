import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserModel } from "../../models/UserModel";

export const Navbar = ({ toggle }: { toggle: () => void }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();
  const [users, setUsers] = useState<UserModel>();
  const [httpError, setHttpError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        history.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/users/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          history.push("/login");
          return;
        }

        if (!response.ok) {
          history.push("/login");
          throw new Error('Something went wrong!');
        }

        const data = await response.json();
        setUsers(data);

      } catch (error: any) {
        setHttpError(error.message);
      }
    };

    fetchTodos();
  }, [history]);

  if (httpError) {
    return <p className="text-danger">{httpError}</p>;
  }
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

        <div className="dropdown">
          <button
            className="btn bg-opacity-100 border-0 p-0"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle" style={{ fontSize: 30 }}></i>
          </button>

          <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: "190px" }}>
            <li>
              <h5 className="dropdown-item-text">
                Hi, {users?.fullName}
              </h5>
            </li>
            <li>
              {users?.authorities?.some(a => a.authority === "ROLE_ADMIN") ?
                (
                  <Link to={`/admin`} className="dropdown-item btn">User management</Link>)
                :
                ("")}
            </li>
            <li>
              <Link to={`/profile`} className="dropdown-item btn">Profile</Link>
            </li>
            <li><hr className="dropdown-divider" /></li>

            <li>
              <button
                type="button"
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};