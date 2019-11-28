import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarBrand } from 'shards-react';

import { Constants } from '../../../store';

function SidebarMainNavbar({ hideLogoText, dispatchAction }) {
  const handleToggleSidebar = () => dispatchAction(Constants.TOGGLE_SIDEBAR);

  return (
    <div className="main-navbar">
      <Navbar
        className="align-items-stretch bg-white flex-md-nowrap border-bottom p-0"
        type="light"
      >
        <NavbarBrand
          className="w-100 mr-0"
          href="#"
          style={{ lineHeight: '25px' }}
        >
          <div className="d-table m-auto">
            <img
              id="main-logo"
              className="d-inline-block align-top mr-1"
              style={{ maxWidth: '25px' }}
              src={require('../../../images/shards-dashboards-logo.svg')}
              alt="Shards Dashboard"
            />
            {!hideLogoText && (
              <span className="d-none d-md-inline ml-1">Shards Dashboard</span>
            )}
          </div>
        </NavbarBrand>
        {/* eslint-disable-next-line */}
        <a
          className="toggle-sidebar d-sm-inline d-md-none"
          onClick={handleToggleSidebar}
        >
          <i className="material-icons">&#xE5C4;</i>
        </a>
      </Navbar>
    </div>
  );
}

SidebarMainNavbar.propTypes = {
  dispatchAction: PropTypes.func.isRequired,
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool,
};

SidebarMainNavbar.defaultProps = {
  hideLogoText: false,
};

export default SidebarMainNavbar;
