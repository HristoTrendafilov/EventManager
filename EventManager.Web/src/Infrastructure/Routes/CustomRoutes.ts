// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CustomRoutes {
  static usersLogin() {
    return '/users/login';
  }

  static usersRegister() {
    return '/users/register';
  }

  static usersAdminPanel() {
    return '/users/admin-panel';
  }

  static usersAdminPanelRegions() {
    return '/users/admin-panel/regions';
  }

  static usersAdminPanelCrudLogs() {
    return '/users/admin-panel/crud-logs';
  }

  static usersAdminPanelUserRoles() {
    return '/users/admin-panel/user-roles';
  }

  static usersView(userId?: number) {
    if (userId) {
      return `/users/${userId}/view`;
    }

    return '/users/:userId/view';
  }

  static usersUpdate(userId?: number) {
    if (userId) {
      return `/users/${userId}/update`;
    }

    return '/users/:userId/update';
  }

  static eventsNew() {
    return '/events/new';
  }

  static eventsUpdate(eventId?: number) {
    if (eventId) {
      return `/events/${eventId}/update`;
    }

    return '/events/:eventId/update';
  }

  static eventsView(eventId?: number) {
    if (eventId) {
      return `/events/${eventId}/view`;
    }

    return '/events/:eventId/view';
  }

  static eventsSearchBase() {
    return '/events/search';
  }

  static eventsSearchPage(page?: number) {
    if (page) {
      return `/events/search/${page}`;
    }

    return '/events/search/:page?';
  }
}
