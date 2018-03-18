<template>
  <div>
    <md-card>
      <md-card-header>
        <div class="md-title">Add Card To Deck</div>
      </md-card-header>

      <md-card-content>
        <md-field>
          <md-icon>chat</md-icon>
          <label>Question</label>
          <md-input ref="questionInput" v-model="newCard.question"></md-input>
        </md-field>
        <md-field>
          <md-icon>comment</md-icon>
          <label>Answer</label>
          <md-input v-model="newCard.answer" @keydown.enter="saveCard"></md-input>
        </md-field>
      </md-card-content>

      <md-card-actions>
        <md-button @click="saveCard">Save</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
  export default {
    name: 'add',
    data () {
      return {
        newCard: {
          question: '',
          answer: ''
        }
      }
    },
    computed: {
      deck () {
        return this.$store.state.decks.decks[this.$route.params.id]
      }
    },
    methods: {
      saveCard () {
        this.$nextTick(() => {
          this.$store.dispatch('addCard', {
            question: this.newCard.question,
            answer: this.newCard.answer
          }).then((documentReference) => {
            this.$store.dispatch('addCardToDeck', {deck: this.deck, cardId: documentReference.id})
          })
          this.resetForm()
        })
      },
      resetForm () {
        this.newCard = {
          question: '',
          answer: ''
        }
        this.$refs.questionInput.$el.focus()
      }
    },
    beforeRouteEnter (to, from, next) {
      // TODO: wait for firestorm to sync!
      next(vm => {
        vm.resetForm()
      })
    }
  }
</script>

<style scoped>

</style>
