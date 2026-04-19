import { devtools, subscribeWithSelector } from "zustand/middleware";

const isDev = process.env.NODE_ENV !== "production";

// Central place for shared Zustand middleware so all stores are configured consistently.
export const withBaseMiddlewares = (storeName, stateCreator) => {
  const withSubscriptions = subscribeWithSelector(stateCreator);

  if (!isDev) {
    return withSubscriptions;
  }

  return devtools(withSubscriptions, { name: storeName });
};
