<template>
  <div class="row justify-around">
    <div class="col-sm-12 col-md-6">
      <apexcharts width="100%" type="area" :options="options" :series="series"></apexcharts>
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
        tooltip: {
          enabled: true,
          shared: true,
          followCursor: false,
          intersect: false,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: false,
          onDatasetHover: {
            highlightDataSeries: false
          },
          x: {
            show: true,
            format: 'dd MMM',
            formatter: undefined
          },
          y: {
            formatter: undefined,
            title: {
              formatter: (seriesName) => seriesName + 'teste'
            }
          },
          z: {
            formatter: undefined,
            title: 'Size: '
          },
          marker: {
            show: true
          },
          items: {
            display: 'flex'
          },
          fixed: {
            enabled: false,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'center',
          formatter (val, opt) {
            return val > 0 ? 'R$: ' + val : val
          },
          offsetX: 0
        },
        title: {
          text: 'Total de Vendas do mes de outubro',
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize: '22px',
            color: 'black'
          }
        }
      },
      series: [{
        name: 'Total do dia',
        data: this.formatData(this.date)
      }]
    }
  },
  methods: {
    formatData (date) {
      const d = new Date(date)
      const days = Array.from({ length: new Date(d.getFullYear(), d.getMonth(), 0).getDate() })
      return days.map((day, index) => {
        return {
          x: index + 1,
          y: this.getAmounthOfDay(index + 1)
        }
      })
    },

    getAmounthOfDay (day) {
      return this.payments().filter(payment => {
        return new Date(payment.timestamp).toLocaleDateString() === new Date(String((new Date(this.date).getMonth() + 1) + '/' + day + '/' + new Date(this.date).getFullYear())).toLocaleDateString()
      })
        .reduce((acc, cur) => {
          return acc + cur.service.price
        }, 0)
    }
  }
}
</script>

<style>
</style>
