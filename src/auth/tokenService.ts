// Access token is stored in memory only during the tab session.
// Refresh token is stored as an httpOnly cookie by the backend.
let memoryToken: string | null = null;

export const tokenService = {
  getToken: () => memoryToken,
  setToken: (t: string | null) => {
    memoryToken = t;
    // When clearing token, broadcast logout so other tabs can react.
    if (t === null) {
      try {
        localStorage.setItem('auth_event', `logout:${Date.now()}`);
      } catch (e) {
        // ignore storage errors
      }
    }
  },
};
