import { createStore } from "zustand/vanilla";
import { withBaseMiddlewares } from "../../config/zustand.config.js";
import { createSessionSlice } from "./slices/session.slice.js";
import { createRequestSlice } from "./slices/request.slice.js";

const appStoreCreator = (...args) => ({
  ...createSessionSlice(...args),
  ...createRequestSlice(...args),
});

export const appStore = createStore(
  withBaseMiddlewares("app-store", appStoreCreator),
);
