
let memoryToken: string | null = null;

export const tokenService = {
  getToken: () => memoryToken,
  setToken: (t: string | null) => {
    memoryToken = t;
   
    if (t === null) {
      try {
        localStorage.setItem('auth_event', `logout:${Date.now()}`);
      } catch (e) {
        // ignore storage errors
      }
    }
  },
};
