import { Link } from "react-router-dom";

export const Navbar = ({ toggle }: { toggle: () => void }) => {
  return (
    <nav className='navbar navbar-dark border-bottom'>
      <div className='container-fluid'>

        <button
          className='navbar-toggler d-block bg-secondary bg-opacity-25'
          onClick={toggle}
        >
          <div className='d-block align-items-center justify-content-center'>
            <i className="bi bi-list text-black" style={{ fontSize: '35px' }}></i>
          </div>
        </button>

        <Link className='fw-semibold' to="/"
          style={{ fontSize: '24px', textDecoration: 'none', color: 'inherit' }}>
          Note4U
        </Link>
        <button className='btn btn-primary'>Sign in</button>
      </div>
    </nav>
  );
};