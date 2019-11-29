import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col } from 'shards-react';

import { Constants } from '../../../store';

import SidebarMainNavbar from './SidebarMainNavbar';
// import SidebarSearch from './SidebarSearch';
import SidebarNavItems from './SidebarNavItems';

function MainSidebar({ menuVisible, items, hideLogoText }) {
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
    'main-sidebar',
    'px-0',
    'col-12',
    menuVisible && 'open'
  );

  return (
    <Col tag="aside" className={classes} md={{ size: 2 }}>
      <SidebarMainNavbar
        hideLogoText={hideLogoText}
        dispatchAction={reduxHandler}
      />
      {/* <SidebarSearch /> */}
      <SidebarNavItems items={items} />
    </Col>
  );
}

MainSidebar.propTypes = {
  menuVisible: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.element),
  /**
   * Whether to hide the logo text, or not.
   */
  hideLogoText: PropTypes.bool,
};

MainSidebar.defaultProps = {
  menuVisible: false,
  items: [],
  hideLogoText: false,
};

const mapStateToProps = state => ({
  menuVisible: state.sidebar.menuVisible,
  items: state.sidebar.navItems,
});

export default connect(mapStateToProps)(MainSidebar);
