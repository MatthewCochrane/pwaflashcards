import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import cards from './modules/cards'
import decks from './modules/decks'
import results from './modules/results'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    cards,
    decks,
    results
  }
})
