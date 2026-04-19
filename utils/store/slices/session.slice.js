export const createSessionSlice = (set) => ({
  currentUser: null,
  token: null,
  setSession: ({ user, token }) =>
    set({ currentUser: user ?? null, token: token ?? null }),
  clearSession: () => set({ currentUser: null, token: null }),
});
