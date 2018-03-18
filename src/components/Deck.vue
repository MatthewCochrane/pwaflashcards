<template>
  <div>
    <span class="md-headline" v-if="deck">{{deck.name}}</span>
    <md-tabs md-sync-route>
      <md-tab id="tab-cards" md-label="Cards" :to="'/deck/' + $route.params.id + '/cards'"></md-tab>
      <!--<md-tab id="tab-stats" md-label="Stats" :to="'/track/' + $route.params.id + '/stats'"></md-tab>-->
      <md-tab id="tab-settings" md-label="Settings" :to="'/deck/' + $route.params.id + '/settings'"></md-tab>
      <md-tab id="tab-add-card" md-label="Add Card" :to="'/deck/' + $route.params.id + '/addcard'"></md-tab>
    </md-tabs>
    <router-view></router-view>

    <md-speed-dial class="md-bottom-right" v-if="!$route.path.endsWith('addcard')">
      <md-speed-dial-target class="md-primary">
        <md-icon>send</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button class="md-icon-button md-accent md-raised" :to="'/deck/' + $route.params.id + '/quiz/hard'">
          <md-icon>done</md-icon>
        </md-button>
        <md-button class="md-icon-button md-primary md-raised" :to="'/deck/' + $route.params.id + '/quiz/all'">
          <md-icon>done_all</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
  </div>
</template>

<script>
  export default {
    name: 'deck-main',
    computed: {
      deck () {
        return this.$store.state.decks.decks[this.$route.params.id]
      }
    }
  }
</script>

<style scoped>

</style>
