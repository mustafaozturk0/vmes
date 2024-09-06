import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/AuthSlice";
import { ConfigureStoreOptions } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { authApi } from "../api/auth/authApi";
import cameraReducer from "../slices/camera/cameraSlice";
import yoloReducer from "../slices/yolo/yoloSlice";
import outputReducer from "../slices/output/outputSlice";
import factoryReducer from "../slices/factory/factorySlice";

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [authApi.reducerPath]: authApi.reducer,
      auth: authReducer,
      camera: cameraReducer,
      yolo: yoloReducer,
      output: outputReducer,
      factory: factoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(api.middleware, authApi.middleware),
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
