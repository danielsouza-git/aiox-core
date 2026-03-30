/**
 * Navigation module for brand book hierarchical sidebar.
 *
 * @module navigation
 */
export {
  buildNavigationTree,
  getNavItems,
  findNavItem,
  findParentSection,
  isActiveSection,
  generateBreadcrumbs,
  getSectionIcon,
  type NavSection,
  type NavItem,
  type Breadcrumb,
  type BreadcrumbResult,
} from './nav-tree';
