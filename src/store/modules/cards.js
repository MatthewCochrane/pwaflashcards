import firestore from '../firestore'

export default {
  state: {
    cards: {}
  },
  mutations: {
    updateCards (state, decks) {
      state.cards = decks
    }
  },
  actions: {
    addCard ({ commit }, data) {
      return firestore.cardsColRef.add(data)
    },
    deleteCard ({ commit }, id) {
      return firestore.cardsColRef.delete(id)
    },
    updateCard ({ commit }, card) {
      return firestore.cardsColRef.doc(card.id).set(card)
    }
  },
  getters: {}
}
