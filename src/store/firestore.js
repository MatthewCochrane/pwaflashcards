import firebase from 'firebase'
import store from './store'
require('firebase/firestore')

const config = {
  apiKey: 'AIzaSyA_CLIA8y7c3-fqlE1L1Ev1CljTi6xqi1k',
  authDomain: 'flashcards-b77be.firebaseapp.com',
  databaseURL: 'https://flashcards-b77be.firebaseio.com',
  projectId: 'flashcards-b77be',
  storageBucket: 'flashcards-b77be.appspot.com',
  messagingSenderId: '641794244193'
}

firebase.initializeApp(config)

var refs = {
  db: null,
  decksColRef: null,
  cardsColRef: null,
  resultsColRef: null,
  decksReady: false,
  cardsReady: false,
  resultsReady: false
}

function updateReadyInStore () {
  store.commit('setFirestoreReady', refs.decksReady && refs.cardsReady && refs.resultsReady)
}

let cancelDecksWatcher = null
let cancelCardsWatcher = null
let cancelResultsWatcher = null

firebase.firestore().enablePersistence()
  .then(() => {
    // Initialise Cloud Firestore through firebase
    refs.db = firebase.firestore()
    firebase.auth().onAuthStateChanged(user => {
      if (user == null) {
        if (cancelDecksWatcher) cancelDecksWatcher()
        if (cancelCardsWatcher) cancelCardsWatcher()
        if (cancelCardsWatcher) cancelResultsWatcher()
        refs.decksReady = false
        refs.cardsReady = false
        refs.resultsReady = false
        refs.decksColRef = null
        refs.cardsColRef = null
        refs.resultsColRef = null
        updateReadyInStore()
        return
      }

      const userDocRef = refs.db.collection('users').doc(user.uid)

      userDocRef.get().then(doc => {
        if (!doc.exists) {
          // Doc does not exist.  Create it!
          return userDocRef.set({
            displayName: user.displayName,
            email: user.email,
            settings: {test: false}
          })
        }
      }).then(() => {
        refs.decksColRef = userDocRef.collection('decks')
        refs.cardsColRef = userDocRef.collection('cards')
        refs.resultsColRef = userDocRef.collection('results')

        cancelDecksWatcher = refs.decksColRef.onSnapshot(deckQuerySnapshot => {
          const myDecks = {}
          deckQuerySnapshot.forEach(doc => {
            myDecks[doc.id] = {id: doc.id, ...doc.data()}
          })
          store.commit('updateDecks', myDecks)
          if (!refs.decksReady) {
            refs.decksReady = true
            updateReadyInStore()
          }
        })

        cancelCardsWatcher = refs.cardsColRef.onSnapshot(cardsQuerySnapshot => {
          const myCards = {}
          cardsQuerySnapshot.forEach(doc => {
            myCards[doc.id] = {id: doc.id, ...doc.data()}
          })
          store.commit('updateCards', myCards)
          if (!refs.cardsReady) {
            refs.cardsReady = true
            updateReadyInStore()
          }
        })

        cancelResultsWatcher = refs.resultsColRef.onSnapshot(resultsQuerySnapshot => {
          const myResults = []
          resultsQuerySnapshot.forEach(doc => {
            myResults.push({id: doc.id, ...doc.data()})
          })
          store.commit('updateResults', myResults)
          if (!refs.resultsReady) {
            refs.resultsReady = true
            updateReadyInStore()
          }
        })
      }).catch((err) => {
        console.log(err)
      })
    })
  })
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time
      alert('Multiple tabs open, persistence can only be enabled in one tab at a time')
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      alert('The current browser does not support all of the features required to enable persistence')
    }
  })

export default refs

// export default function () {
//   return refs
// }

// export default {
//   addDeck: data => {
//     return refs.decksColRef.add(data)
//   },
//   removeDeck: id => {
//     return refs.decksColRef.doc(id).delete()
//   },
//   updateDeck: deck => {
//     return refs.decksColRef.doc(deck.id).set(deck)
//   },
//   addCard: data => {
//     return refs.cardsColRef.add(data)
//   },
//   removeCard: id => {
//     return refs.cardsColRef.doc(id).delete()
//   },
//   updateCard: card => {
//     return refs.cardsColRef.doc(card.id).set(card)
//   }
// }
