<template>
  <div>
    <!--Times answered: {{stats.count}}<br/>-->
    <md-icon v-if="percCorrect < 50.0" style="color: red;">mood_bad</md-icon>
    <md-icon v-if="percCorrect >= 50.0 && percCorrect < 90.0" style="color: orange;">sentiment_neutral</md-icon>
    <md-icon v-if="percCorrect >= 90.0" style="color: green;">sentiment_very_satisfied</md-icon>
    {{Math.round(percCorrect)}}%
  </div>
</template>

<script>
  export default {
    props: ['cardId'],
    name: 'card-stats',
    computed: {
      stats () {
        return this.$store.getters.getCardResultStats(this.cardId)
      },
      percCorrect () {
        return this.stats.correct / this.stats.count * 100.0
      }
    }
  }
</script>

<style scoped>

</style>
