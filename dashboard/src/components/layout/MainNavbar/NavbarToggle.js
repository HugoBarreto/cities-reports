import React from 'react';
import PropTypes from 'prop-types';

import { Constants } from '../../../store';

function NavbarToggle({ dispatchAction }) {
  const handleClick = () => dispatchAction(Constants.TOGGLE_SIDEBAR);

  return (
    <nav className="nav">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        onClick={handleClick}
        className="nav-link nav-link-icon toggle-sidebar d-sm-inline d-md-none text-center"
      >
        <i className="material-icons">&#xE5D2;</i>
      </a>
    </nav>
  );
}

NavbarToggle.propTypes = {
  dispatchAction: PropTypes.func.isRequired,
};

export default NavbarToggle;
