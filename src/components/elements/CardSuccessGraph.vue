<script>
  import { Line } from 'vue-chartjs'

  export default {
    extends: Line,
    props: ['cardId'],
    name: 'card-success-graph',
    methods: {
      movingAvg (arr, size) {
        var win = []
        var i = []
        var newarr = []
        for (i = size - 1; i <= arr.length; i++) {
          win = arr.slice(i - size, i)
          if (win.length === size) {
            newarr.push(this.$lodash.mean(win))
          }
        }
        return newarr
      }
    },
    mounted () {
      let sortedResults = this.$store.getters.getResultsForCard(this.cardId).sort(function compare (a, b) {
        let dateA = new Date(a.timestamp)
        let dateB = new Date(b.timestamp)
        return dateA - dateB
      })

      let mAvgLen = 3 // sortedResults.length < 20 ? sortedResults.length / 4 : 10

      let correct = this.$lodash.times(mAvgLen, this.$lodash.constant(0)).concat(
        this.movingAvg(this.$lodash.map(sortedResults, result => result.correct ? 1 : 0), mAvgLen))

      // console.log(sortedResults)

      this.renderChart({
        labels: this.$lodash.range(1, sortedResults.length + 1),
        datasets: [
          {
            label: 'Time Taken',
            yAxisID: 'A',
            borderColor: '#f87979',
            data: this.$lodash.map(sortedResults, result => result.timeTaken)
          },
          {
            label: 'Correct',
            yAxisID: 'B',
            borderColor: '#7979f8',
            tension: 0, // disables bezier curves
            data: correct
          }
        ]
      },
      {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              id: 'A',
              type: 'linear',
              position: 'left',
              display: false,
              ticks: {
                suggestedMin: 0,
                suggestedMax: 10000
              }
            },
            {
              id: 'B',
              type: 'linear',
              position: 'right',
              display: false
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        }
      })
    }
  }
</script>

<style scoped>

</style>
