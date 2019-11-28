import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Container, Navbar } from 'shards-react';

import { Constants } from '../../../store';

// import NavbarSearch from './NavbarSearch';
// import NavbarNav from './NavbarNav/NavbarNav';
import NavbarToggle from './NavbarToggle';

const MainNavbar = ({ stickyTop }) => {
  const dispatch = useDispatch();

  function reduxHandler(type, data = null) {
    switch (type) {
      case Constants.TOGGLE_SIDEBAR:
        dispatch({
          type: Constants.TOGGLE_SIDEBAR,
          data,
        });
        break;

      default:
        break;
    }
  }

  const classes = classNames(
    'main-navbar',
    'bg-white',
    stickyTop && 'sticky-top'
  );

  return (
    <div className={classes}>
      <Container className="p-0">
        <Navbar
          type="light"
          className="align-items-stretch flex-md-nowrap p-0 d-sm-flex d-md-none"
        >
          {/* <NavbarSearch /> */}
          {/* <NavbarNav /> */}
          <NavbarToggle dispatchAction={reduxHandler} />
        </Navbar>
      </Container>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  // layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool,
};

MainNavbar.defaultProps = {
  stickyTop: true,
};

export default connect()(MainNavbar);
