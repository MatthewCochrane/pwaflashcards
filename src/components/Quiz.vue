<template>
<div v-if="firestoreReady" class="quiz-container">
  <div v-if="!startedQuiz">
    <md-empty-state
      :md-label="deck.name"
      md-description="Are you ready to start?">
      <md-button class="md-primary md-raised" @click="startQuiz">Start Now</md-button>
    </md-empty-state>
  </div>

  <md-card v-if="quizIsRunning" class="quiz-card"  @click.native="showingAnswer = !showingAnswer">
    <div class="quiz-card-content">
      <div :class="{'md-main-text': !showingAnswer, 'md-sub-text': showingAnswer}">{{currentCard.question}}</div>
      <!--<md-button v-if="!showingAnswer" @click="showingAnswer = true" class="md-raised">I know the answer!</md-button>-->
      <div v-if="showingAnswer" class="md-main-text">{{currentCard.answer}}</div>
      <md-button v-if="showingAnswer" @click.stop="nextQuestion(true)" class="md-primary md-raised">I got it right</md-button>
      <md-button v-if="showingAnswer" @click.stop="nextQuestion(false)" class="md-accent md-raised">I got it wrong</md-button>
    </div>
  </md-card>

  <md-card v-if="finishedQuiz" class="quiz-card">
    <div class="md-title question">You're Finished!</div>
    <div>Here's how you went</div>
    <div>Correct Answers: <strong>{{correctlyAnswered}}</strong></div>
    <div>Incorrect Answers: <strong>{{incorrectlyAnswered}}</strong></div>
    <md-button v-if="showingAnswer" @click="$router.go(-1)" class="md-primary md-raised">Go Back</md-button>
  </md-card>

  <div style="position: fixed; bottom: 0; right: 0;">
    {{unshownCards.length + 1}}
  </div>

</div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'quiz',
    data () {
      return {
        correctlyAnswered: 0,
        incorrectlyAnswered: 0,
        results: [],
        skipped: [],
        unshownCards: [],
        currentCardId: null,
        showingAnswer: false,
        startedQuiz: false,
        finishedQuiz: false,
        cardStartMillis: null
      }
    },
    computed: {
      deck () {
        return this.$store.state.decks.decks[this.$route.params.id]
      },
      currentCard () {
        if (this.currentCardId == null) return null
        return this.$store.state.cards.cards[this.currentCardId]
      },
      quizIsRunning () {
        return this.startedQuiz && !this.finishedQuiz
      },
      ...mapState({
        firestoreReady: state => state.auth.firestoreReady
      })
    },
    methods: {
      getIncludedCards () {
        if (this.$route.params.type === 'all') {
          return this.deck.cards
        } else if (this.$route.params.type === 'hard') {
          var cards = []
          this.deck.cards.forEach(card => {
            let cardStats = this.$store.getters.getCardResultStats(card)
            if (cardStats.correct / cardStats.count > 0.90) return
            cards.push(card)
          })
          return cards
        }
        return []
      },
      startQuiz () {
        this.startedQuiz = true
        this.unshownCards = this.$lodash.shuffle(this.getIncludedCards())
        // this.unshownCards = this.$lodash.shuffle(this.deck.cards)
        this.nextQuestion()
      },
      nextQuestion (correct) {
        if (this.currentCardId != null) {
          let timeTakenOnQuestion = (new Date()).valueOf() - this.cardStartMillis

          let result = {
            timestamp: new Date(),
            cardId: this.currentCardId,
            timeTaken: timeTakenOnQuestion,
            correct: correct
          }

          this.results.push(result)
          if (correct) this.correctlyAnswered++
          else this.incorrectlyAnswered++
        }
        if (this.unshownCards.length) {
          if (!correct && this.currentCardId != null) {
            // this.unshownCards.unshift(this.currentCardId)
            this.unshownCards.push(this.currentCardId)
            this.unshownCards = this.$lodash.shuffle(this.unshownCards)
          }
          this.currentCardId = this.unshownCards.pop()
          console.log(this.unshownCards)

          this.showingAnswer = false
          this.$nextTick(() => {
            this.cardStartMillis = (new Date()).valueOf()
          })
        } else {
          this.finishedQuiz = true
          this.finishQuiz()
        }
      },
      finishQuiz () {
        this.$store.dispatch('addManyResults', this.results)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .quiz-container {
    height: 100%;
    display: grid;
  }

  .quiz-card {
    margin: auto;

    min-width: 200px;
    min-height: 200px;

    max-width: 95vw;
    max-height: 80vh;

    text-align: center;
    overflow: hidden;

    display: grid;
  }

  .quiz-card-content {
    margin: auto;
    padding: 4vh 4vw;

    .md-main-text {
      margin-top: 2vh;
      margin-bottom: 2vh;
      font-size: 10vw;
      line-height: 10vw;
    }

    .md-sub-text {
      color: var(--md-theme-demo-light-text-accent-on-background-variant,rgba(0,0,0,.54));
      font-size: 5vw;
      line-height: 5vw;
    }

    .md-button {
      /*width: 15vw;*/
      height: 10vh;
    }

  }
</style>
