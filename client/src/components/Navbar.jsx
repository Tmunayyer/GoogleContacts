import React from 'react';

const Navbar = ({ syncClickHandler }) => {
  return (
    <div className="navbar">
      <h2 className="navbar-item title">Comtacts</h2>
      <div className="navbar-item sync-button">
        <button className="sync" onClick={syncClickHandler}>
          Sync Contacts
        </button>
      </div>
    </div>
  );
};

export default Navbar;
