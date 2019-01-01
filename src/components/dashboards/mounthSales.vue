<template>
  <div class="row justify-around">
    <div class="col-sm-12" id="chart">
      <apexcharts height="350px" type="area" :options="options" :series="series"></apexcharts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'MounthSales',
  props: [
    'payments',
    'date'
  ],
  components: {
    apexcharts: VueApexCharts
  },
  data () {
    return {
      options: {
        chart: {
          id: 'mounth-total'
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return 'R$ ' + value.toFixed(2)
            }
          }
        },
        xaxis: {
          categories: this.formatData(this.date, 'x'),
          labels: {
            formatter: function (value) {
              return 'Dia ' + value
            }
          }
        }
      },
      series: [{
        name: 'Total do dia',
        data: this.formatData(this.date, 'y')
      }]
    }
  },
  methods: {
    formatData (date, XY) {
      const d = new Date(date)
      const days = Array.from({ length: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() })
      return days.map((day, index) => {
        return {
          x: (index + 1),
          y: this.getAmounthOfDay(index + 1)
        }
      }).filter(({ y }) => y !== 0).map(obj => obj[XY])
    },

    getAmounthOfDay (day) {
      return this.payments.filter(payment => {
        return new Date(payment.timestamp).toLocaleDateString() === new Date(String((new Date(this.date).getMonth() + 1) + '/' + day + '/' + new Date(this.date).getFullYear())).toLocaleDateString()
      })
        .reduce((acc, cur) => {
          return acc + cur.service.price
        }, 0.0)
    }
  }
}
</script>

<style>
</style>
