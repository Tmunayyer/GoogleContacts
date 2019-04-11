import React from 'React';

const Navbar = (props) => {
  return (
    <div className="navbar">
      <h2 className="navbar-item title">Comtacts</h2>
      <div className="navbar-item logout-button">
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
