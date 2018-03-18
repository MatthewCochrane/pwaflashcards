import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Dash from '@/components/Dash'
import Login from '@/components/Login'
import Quiz from '@/components/Quiz'
import Deck from '@/components/Deck'
import DeckCards from '@/components/Deck/Cards'
import DeckAddCard from '@/components/Deck/Add'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Dash',
      component: Dash,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/deck/:id/quiz/:type',
      name: 'Quiz',
      component: Quiz,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/deck/:id',
      name: 'Deck',
      component: Deck,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'cards',
          component: DeckCards
        },
        // {
        //   path: 'stats',
        //   component: TrackStats
        // },
        // {
        //   path: 'settings',
        //   component: DeckSettings
        // },
        {
          path: 'addcard',
          component: DeckAddCard
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('/')
  else next()
})

export default router
