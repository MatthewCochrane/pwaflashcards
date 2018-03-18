<template>
  <div>
    <md-empty-state
      v-if="$lodash.isEmpty(cards)"
      md-icon="sentiment_dissatisfied"
      md-label="You Don't have Any Cards In This Deck"
      md-description="A list of cards will be displayed here once you add some cards.">
      <md-button class="md-primary md-raised" @click="showAddDeckDialog = true">Add A Card To The Deck</md-button>
    </md-empty-state>

    <div v-else style="text-align: center; margin-top: 20px; margin-bottom: 150px;">
      <md-card class="card-card"
               v-for="card in cards"
               v-bind:key="card.id" md-with-hover>
          <md-card-header>
            <div class="md-title" style="flex: 1">
              <span>{{card.question}}</span>
            </div>
          </md-card-header>
          <!--<md-card-content>-->
            <!--TODO: put content here-->
            <div style="padding-bottom: 10px;">
              {{card.answer}}
            </div>
            <card-stats :cardId="card.id"></card-stats>
            <card-success-graph :height="100" :cardId="card.id"></card-success-graph>
          <!--</md-card-content>-->

          <md-card-actions>
            <md-button class="md-icon-button md-dense" @click.stop="editCard(card)">
              <md-icon>
                edit
              </md-icon>
            </md-button>
            <md-button class="md-icon-button md-dense" @click.stop="removeCard(card)">
              <md-icon>
                delete
              </md-icon>
            </md-button>
            <!--<md-button class="md-icon-button" :to="'/track/' + track.id + '/list'">-->
            <!--<md-icon>-->
            <!--keyboard_voice-->
            <!--</md-icon>-->
            <!--</md-button>-->
          </md-card-actions>
      </md-card>

      <!--<md-button class="md-fab md-fab-bottom-right" @click="showAddDeckDialog = true">-->
        <!--<md-icon>add_to_photos</md-icon>-->
      <!--</md-button>-->
    </div>
  </div>
</template>

<script>
  import CardStats from '@/components/elements/CardStats'
  import CardSuccessGraph from '@/components/elements/CardSuccessGraph'

  export default {
    name: 'cards',
    components: {
      'card-stats': CardStats,
      'card-success-graph': CardSuccessGraph
    },
    computed: {
      deck () {
        if (this.$store.state.decks == null) return null
        return this.$store.state.decks.decks[this.$route.params.id]
      },
      cards () {
        return this.$store.getters.getCardsInDeck(this.$route.params.id)
      }
    },
    methods: {
      removeCard (card) {
        console.log(this.deck)
        this.$store.dispatch('removeCardFromDeck', {deck: this.deck, cardId: card.id})
      },
      editCard (card) {

      },
      getCardAnswerStats (cardId) {
        return this.$store.getters.getCardResultStats(cardId)
      }
    }
  }
</script>

<style scoped>
  .card-card {
    width: 200px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
</style>
