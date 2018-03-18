export default {
  state: {
    currentUser: null,
    firestoreReady: false
  },
  mutations: {
    setCurrentUser (state, payload) {
      if (payload == null) {
        state.currentUser = null
      } else {
        state.currentUser = {
          uid: payload.uid,
          displayName: payload.displayName,
          email: payload.email,
          photoURL: payload.photoURL
        }
      }
    },
    setFirestoreReady (state, payload) {
      state.firestoreReady = payload
    }
  },
  actions: {

  },
  getters: {
    getCurrentUser (state) {
      return state.currentUser
    }
  }
}
