import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Chain Art-Certificate</h1>
            <div className="links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="createcertificate">Create Certificate</NavLink>
                {/* <NavLink to="help">Help</NavLink> */}
            </div>
        </nav>
    );
} 

export default Navbar;