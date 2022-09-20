import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { rootAuthSaga } from './authSaga';
import authReducer from './authSlice';
import firestoreReducer from './firestoreSlice';
import { rootStreamAnnouncements, rootStreamSignals, rootStreamUsers } from './firestoreSaga';
import appReducer from './appSlice';

let sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    app: appReducer,
    firebaseAuth: authReducer,
    firestore: firestoreReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootAuthSaga);
sagaMiddleware.run(rootStreamSignals);
sagaMiddleware.run(rootStreamAnnouncements);
sagaMiddleware.run(rootStreamUsers);

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
