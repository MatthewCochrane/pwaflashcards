<template>
    <div>
      <md-empty-state
        v-if="$lodash.isEmpty(decks)"
        md-icon="layers"
        md-label="Create your first deck"
        md-description="Your decks will appear here once you create some">
        <md-button class="md-primary md-raised" @click="showAddDeckDialog = true">Create First Deck</md-button>
      </md-empty-state>

      <div v-else>
        <md-card class="track-card md-primary"
                 v-for="deck in decks"
                 v-bind:key="deck.id" md-with-hover>
          <md-ripple @click.native="$router.push('/deck/' + deck.id + '/cards')">
            <md-card-header>
              <h4 class="md-title" style="flex: 1">
                <span>{{deck.name}}</span></h4>
            </md-card-header>
            <md-card-content>
              <!--TODO: put content here-->
            </md-card-content>

            <!--<md-card-actions>-->
              <!--<md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/list')">-->
                <!--<md-icon>-->
                  <!--visibility-->
                <!--</md-icon>-->
              <!--</md-button>-->
              <!--<md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/settings')">-->
                <!--<md-icon>-->
                  <!--settings-->
                <!--</md-icon>-->
              <!--</md-button>-->
              <!--<md-button class="md-icon-button md-dense" @click.stop="$router.push('/track/' + track.id + '/add')">-->
                <!--<md-icon>-->
                  <!--add-->
                <!--</md-icon>-->
              <!--</md-button>-->
              <!--&lt;!&ndash;<md-button class="md-icon-button" :to="'/track/' + track.id + '/list'">&ndash;&gt;-->
              <!--&lt;!&ndash;<md-icon>&ndash;&gt;-->
              <!--&lt;!&ndash;keyboard_voice&ndash;&gt;-->
              <!--&lt;!&ndash;</md-icon>&ndash;&gt;-->
              <!--&lt;!&ndash;</md-button>&ndash;&gt;-->
            <!--</md-card-actions>-->
          </md-ripple>
        </md-card>

        <md-button class="md-fab md-fab-bottom-right" @click="showAddDeckDialog = true">
          <md-icon>add_to_photos</md-icon>
        </md-button>
      </div>

      <md-dialog :md-click-outside-to-close="false"
                 :md-fullscreen="false" :md-active.sync="showAddDeckDialog"
                 @md-cancel="closeAddDeckDialog">
        <md-dialog-title>Create A New Track</md-dialog-title>
        <div class="dialog-padding">
          <md-field>
            <label>Deck Name</label>
            <md-input v-model="newDeckName"></md-input>
          </md-field>

          <md-dialog-actions>
            <md-button class="md-primary" @click="closeAddDeckDialog">Cancel</md-button>
            <md-button class="md-primary" @click="addDeckFromDialog">Add</md-button>
          </md-dialog-actions>
        </div>
      </md-dialog>

    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'dash',
    data () {
      return {
        showAddDeckDialog: false,
        newDeckName: ''
      }
    },
    computed: mapState({
      decks: state => state.decks.decks
    }),
    methods: {
      closeAddDeckDialog () {
        this.showAddDeckDialog = false
        this.newDeckName = ''
      },
      addDeckFromDialog () {
        this.$store.dispatch('addDeck', {
          name: this.newDeckName
        })
        this.closeAddDeckDialog()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~vue-material/dist/theme/engine";

  .dialog-padding {
    padding-left: 20px;
    padding-right: 20px;
  }

  .track-card {
    width: 250px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
