import firestore from '../firestore'
import lodash from 'lodash'

export default {
  state: {
    decks: {}
  },
  mutations: {
    updateDecks (state, decks) {
      state.decks = decks
    }
  },
  actions: {
    addDeck ({ commit }, data) {
      return firestore.decksColRef.add(data)
    },
    deleteDeck ({ commit }, id) {
      return firestore.decksColRef.delete(id)
    },
    updateDeck ({ commit }, deck) {
      return firestore.decksColRef.doc(deck.id).set(deck)
    },
    addCardToDeck ({ commit, dispatch }, data) {
      let clonedDeck = lodash.clone(data.deck)
      if (clonedDeck.cards == null) {
        clonedDeck.cards = []
      }
      clonedDeck.cards.push(data.cardId)
      return dispatch('updateDeck', clonedDeck)
    },
    removeCardFromDeck ({ commit, dispatch }, {deck, cardId}) {
      let clonedDeck = lodash.clone(deck)
      if (clonedDeck.cards == null) return null
      let index = clonedDeck.cards.indexOf(cardId)
      if (index === -1) return null
      clonedDeck.cards.splice(index, 1)
      return dispatch('updateDeck', clonedDeck)
    }
  },
  getters: {
    getCardsInDeck: (state, getters, rootState) => (deckId) => {
      let cards = {}

      if (state.decks[deckId] == null) return {}
      if (state.decks[deckId].cards == null) return {}

      state.decks[deckId].cards.forEach(cardId => {
        if (cardId in rootState.cards.cards) {
          cards[cardId] = rootState.cards.cards[cardId]
        }
      })

      return cards
    }
  }
}
