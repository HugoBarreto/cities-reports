import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'shards-react';

import SidebarNavItem from './SidebarNavItem';

function SidebarNavItems({ items }) {
  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column">
        {items.map(item => (
          <SidebarNavItem key={item.title} item={item} />
        ))}
      </Nav>
    </div>
  );
}

SidebarNavItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export default SidebarNavItems;
