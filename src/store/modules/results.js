import firestore from '../firestore'
import lodash from 'lodash'

export default {
  state: {
    results: []
  },
  mutations: {
    updateResults (state, results) {
      state.results = results
    }
  },
  actions: {
    addResult ({ commit }, data) {
      return firestore.resultsColRef.add(data)
    },
    addManyResults ({ commit }, results) {
      let batch = firestore.db.batch()
      results.forEach((result) => {
        batch.set(firestore.resultsColRef.doc(), result)
      })
      return batch.commit()
    },
    deleteResult ({ commit }, id) {
      return firestore.resultsColRef.delete(id)
    },
    updateResult ({ commit }, result) {
      return firestore.resultsColRef.doc(result.id).set(result)
    }
  },
  getters: {
    getResultsForCard: (state) => (cardId) => {
      return lodash.filter(state.results, (o) => o.cardId === cardId)
    },
    getCardResultStats: (state, getters) => (cardId) => {
      let results = getters.getResultsForCard(cardId)
      let stats = {
        count: 0,
        correct: 0,
        incorrect: 0,
        averageTime: 0,
        averageCorrectTime: 0,
        averageIncorrectTime: 0,
        firstAnswered: null,
        lastAnswered: null,
        lastTimeCorrect: null,
        lastTimeIncorrect: null,
        memoryFactor: 0
      }

      results.forEach(result => {
        stats.count++
        result.correct ? stats.correct++ : stats.incorrect++
        stats.averageTime += result.timeTaken
        result.correct ? stats.averageCorrectTime += result.timeTaken : stats.averageIncorrectTime += result.timeTaken
      })

      stats.averageTime /= stats.count
      stats.averageCorrectTime /= stats.correct
      stats.averageIncorrectTime /= stats.incorrect
      return stats
    }
  }
}
