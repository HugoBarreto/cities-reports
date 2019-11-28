import constants from '../../constants';
import getSidebarNavItems from './sidebar-nav-items';

const { TOGGLE_SIDEBAR } = constants;
const initalState = { menuVisible: false, navItems: getSidebarNavItems() };

export default function sidebar(state = initalState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, menuVisible: !state.menuVisible };
    default:
      return state;
  }
}
