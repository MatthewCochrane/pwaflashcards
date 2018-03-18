<template>
  <div id="app">

    <md-dialog :md-active="!firestoreReady && currentUser !== null">
      <md-dialog-title>Loading</md-dialog-title>
      <md-dialog-content>
        <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
      </md-dialog-content>
    </md-dialog>

    <md-app v-if="firestoreReady || currentUser == null" md-waterfall md-mode="fixed" md-scrollbar>
      <md-app-toolbar v-if="$route.name !== 'Quiz'" class="md-primary">
        <md-button class="md-icon-button" @click="drawerVisible = !drawerVisible">
          <md-icon>menu</md-icon>
        </md-button>

        <md-button to="/" class="md-plain">
          <h1 class="md-title">Flash Cards</h1>
        </md-button>

        <div style="flex: 1"></div>

        <md-button class="md-icon-button">
          <md-icon>timer</md-icon>
        </md-button>

        <md-button class="md-icon-button">
          <md-icon>label</md-icon>
        </md-button>

        <md-menu md-size="big" md-direction="bottom-end" v-if="currentDeck">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>more_vert</md-icon>
          </md-button>
          <md-menu-content>
            <md-menu-item @click="showConfirmDeleteTrackDialog = true">
              Delete Track
            </md-menu-item>
          </md-menu-content>
        </md-menu>

      </md-app-toolbar>

      <md-app-drawer v-if="currentUser" :md-active.sync="drawerVisible">

        <md-content class="md-primary drawer-top" md-elevation="5">
          <div class="drawer-top-item">
            <md-avatar class="md-avatar-icon md-huge">
              <img :src="currentUser.photoURL || 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'" alt="Avatar">
            </md-avatar>
          </div>
          <div class="md-headline drawer-top-item" style="display: inline;">{{currentUser.displayName}}</div>
          <div class="md-subheading drawer-top-item">{{currentUser.email}}</div>
        </md-content>

        <md-list>
          <md-list-item>
            <md-icon>backup</md-icon>
            <span class="md-list-item-text">Backups & Export</span>
          </md-list-item>

          <md-list-item>
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">Settings</span>
          </md-list-item>

          <md-list-item>
            <md-icon>help_outline</md-icon>
            <span class="md-list-item-text">Help</span>
          </md-list-item>

          <md-list-item @click="logout">
            <md-icon>exit_to_app</md-icon>
            <span class="md-list-item-text">Sign Out</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-dialog-confirm
          :md-active.sync="showConfirmDeleteTrackDialog"
          md-title="Are you sure you want to delete this track?"
          md-content="This will delete ALL data assoicated with this track.  Are you sure you want to delete it?"
          md-confirm-text="Delete"
          md-cancel-text="Cancel"
          @md-confirm="deleteCurrentDeck"/>
        <router-view></router-view>
      </md-app-content>

    </md-app>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firestore from './store/firestore'
  import { mapState } from 'vuex'

  export default {
    name: 'app',
    data () {
      return {
        drawerVisible: false,
        showConfirmDeleteTrackDialog: false
      }
    },
    computed: {
      currentDeck () {
        if (!('id' in this.$route.params)) return null
        return this.$store.state.cards.cards[this.$route.params.id]
      },
      ...mapState({
        currentUser: state => state.auth.currentUser,
        firestoreReady: state => state.auth.firestoreReady
      })
    },
    methods: {
      logout () {
        firebase.auth().signOut().then(() => {
          this.$router.replace('login')
          this.drawerVisible = false
        })
      },
      deleteCurrentDeck () {
        firestore.removeTrack(this.currentDeck.id)
        this.$router.replace('/')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-app {
    /*min-height: 100vh;*/
    /*max-height: 100vh;*/
    height: 100vh;
  }

  .drawer-top {
    padding-top: 50px;
    padding-bottom: 20px;
    width: 230px;
    /*height: 200px;*/
    text-align: center;
    display: block;
    overflow: hidden;
  }

  .drawer-top-item {
    float: left;
    width: 100%;
    text-align: center;
  }

  .md-select-menu .md-menu-content {
    z-index: 111;
  }

  .md-avatar.md-huge {
    min-width: 128px;
    min-height: 128px;
    border-radius: 64px;
    font-size: 64px;
  }

  /*.md-app-content {*/
  /*padding: 16px 16px 16px 16px;*/
  /*}*/
</style>
