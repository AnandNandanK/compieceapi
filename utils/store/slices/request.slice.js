export const createRequestSlice = (set) => ({
  activeRequests: 0,
  incrementRequests: () =>
    set((state) => ({ activeRequests: state.activeRequests + 1 })),
  decrementRequests: () =>
    set((state) => ({ activeRequests: Math.max(0, state.activeRequests - 1) })),
});
