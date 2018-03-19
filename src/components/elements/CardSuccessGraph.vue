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

      // Want a single graph with 'performance' over time...
      // correct = more performance
      // answer more quickly = more performance

      var perfVals = []
      var lastTimeTaken = -1
      var lastPerfVal = 0

      sortedResults.forEach((r) => {
        let perfVal = (r.correct ? 1 : -1)

        if (lastTimeTaken > 0) {
          perfVal *= (lastTimeTaken / r.timeTaken)
        }

        perfVal = lastPerfVal + perfVal
        perfVals.push(Math.min(perfVal, 10))

        lastPerfVal = perfVal
        if (r.correct === true) lastTimeTaken = r.timeTaken
      })

      this.renderChart({
        labels: this.$lodash.range(1, sortedResults.length + 1),
        datasets: [
          {
            label: 'Performance',
            yAxisID: 'Perf',
            borderColor: '#7979f8',
            data: perfVals
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
              id: 'Perf',
              type: 'linear',
              position: 'left',
              display: false
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        },
        tooltips: {
          enabled: false
        },
        animation: {
          duration: 0
        }
      })
    }
  }
</script>

<style scoped>

</style>
