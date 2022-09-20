import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { call, cancel, cancelled, fork, put, take } from 'redux-saga/effects';
import { Announcement } from '../models/model.announcement';
import { AuthUser } from '../models/model.authuser';
import { Signal } from '../models/model.signal';
import { db } from '../_firebase/firebase';
import { updateAnnouncements, updateAuthUsers, updateSignals } from './firestoreSlice';
import { sagaTypes } from './_saga';

/* ---------------------------- NOTE INIT STREAMS --------------------------- */
const getStreamSignals = function () {
  const q = query(collection(db, 'signals'), orderBy('timestampCreated', 'desc'));

  return eventChannel((emit) => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return Signal.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate(),
          signalDate: doc.data()!.signalDate?.toDate(),
          signalTime: doc.data()!.signalTime?.toDate(),
          signalDatetime: doc.data()!.signalDatetime?.toDate()
        });
      });
      emit({ x });
    });
    return unsubscribe;
  });
};

const getStreamAnnouncements = function () {
  const q = query(collection(db, 'announcements'), orderBy('timestampCreated', 'desc'));

  return eventChannel((emit) => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return Announcement.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate()
        });
      });
      emit({ x });
    });
    return unsubscribe;
  });
};

const getStreamUsers = function () {
  const q = query(collection(db, 'users'));

  return eventChannel((emit) => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const x = querySnapshot.docs.map((doc) => {
        return AuthUser.fromJson({
          ...doc.data(),
          id: doc.id,
          timestampCreated: doc.data()!.timestampCreated?.toDate(),
          timestampUpdated: doc.data()!.timestampUpdated?.toDate(),
          timestampLastLogin: doc.data()!.lastLogin?.toDate()
        });
      });
      emit({ x });
    });
    return unsubscribe;
  });
};

/* -------------------------- NOTE CONSUME STREAMS -------------------------- */
export function* streamSignals(): any {
  const channel = yield call(getStreamSignals);
  try {
    while (true) {
      const { x } = yield take(channel);
      yield put(updateSignals(x));
    }
  } finally {
    if (yield cancelled()) {
      yield put(updateSignals([]));
      channel.close();
    }
  }
}

export function* streamAnnoucements(): any {
  const channel = yield call(getStreamAnnouncements);
  try {
    while (true) {
      const { x } = yield take(channel);
      yield put(updateAnnouncements(x));
    }
  } finally {
    if (yield cancelled()) {
      yield put(updateAnnouncements([]));
      channel.close();
    }
  }
}

export function* srteamUsers(): any {
  const channel = yield call(getStreamUsers);
  try {
    while (true) {
      const { x } = yield take(channel);
      yield put(updateAuthUsers(x));
    }
  } finally {
    if (yield cancelled()) {
      yield put(updateAuthUsers([]));
      channel.close();
    }
  }
}

/* ----------------------- NOTE EXPORT STARTED STREAMS ---------------------- */
function* rootStreamSignals(): any {
  while (yield take(sagaTypes.STREAM_SIGNALS)) {
    const t = yield fork(streamSignals);
    yield take(sagaTypes.STREAM_SIGNALS_CANCEL);
    yield cancel(t);
  }
}

function* rootStreamAnnouncements(): any {
  while (yield take(sagaTypes.STREAM_ANNOUNCEMENTS)) {
    const t = yield fork(streamAnnoucements);
    yield take(sagaTypes.STREAM_ANNOUNCEMENTS_CANCEL);
    yield cancel(t);
  }
}

function* rootStreamUsers(): any {
  while (yield take(sagaTypes.STREAM_USERS)) {
    const t = yield fork(srteamUsers);
    yield take(sagaTypes.STREAM_USERS_CANCEL);
    yield cancel(t);
  }
}

export { rootStreamSignals, rootStreamAnnouncements, rootStreamUsers };
