<template>
  <div class="row justify-around">
    <div class="col-12"  v-if="payments.length">
      <q-card class="shadow-8 q-pa-sm">
        <div class="row">
          <div class="col-12">
            <apexchart height="500px" :type="options.xaxis.categories.length === 1 ? 'bar' : 'area'" :options="options" :series="series"></apexchart>
          </div>
        </div>
        <div class="toolbar">
          <div class="row justify-end">
            <q-btn @click.stop="exportData(exportTitle)" color="secondary">EXPORTAR PARA EXEL</q-btn>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-sm-12" v-else>
      <div class="row justify-center">
        <span class="q-title">Não houveram recebimentos {{ exportTitle === 'Diário' ? 'neste dia' : exportTitle === 'Semanal' ? 'nesta semana' : 'neste mes' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'payments-chart',
  props: [
    'payments',
    'date',
    'exportTitle',
    'referer',
    'textTitle'
  ],
  computed: {
    ...mapGetters('application', ['getUser'])
  },
  data () {
    return {
      options: {
        chart: {
          id: 'payments-total'
        },
        colors: ['#019688', '#0091EA', '#673AB7'],
        title: {
          text: this.textTitle,
          align: 'center',
          margin: 0,
          offsetX: 0,
          offsetY: 0,
          floating: true,
          style: {
            fontSize: '22px',
            color: '#263238'
          }
        },
        yaxis: {
          min: 0,
          show: true,
          seriesName: 'Valores',
          opposite: false,
          logarithmic: false,
          tickAmount: 6,
          floating: false,
          decimalsInFloat: 2,
          labels: {
            show: true,
            minWidth: 0,
            maxWidth: 160,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              cssClass: 'apexcharts-yaxis-label'
            },
            offsetX: 0,
            offsetY: 0,
            formatter: function (value) {
              return value.toFixed(2)
            }
          },
          axisBorder: {
            show: true,
            color: '#000000',
            offsetX: 0,
            offsetY: 0
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          title: {
            text: 'Valores (R$)',
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              cssClass: 'apexcharts-yaxis-title'
            }
          },
          crosshairs: {
            show: true,
            position: 'back',
            stroke: {
              color: '#b6b6b6',
              width: 1,
              dashArray: 0
            }
          },
          tooltip: {
            enabled: true,
            formatter: (val) => 'R$ ' + val,
            offsetY: 0
          }
        },
        xaxis: {
          type: 'category',
          categories: this.formatData(this.date, 'x'),
          labels: {
            show: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: true,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              colors: [],
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              cssClass: 'apexcharts-xaxis-label'
            },
            offsetX: 0,
            offsetY: 0,
            format: undefined,
            formatter: (val) => 'Dia ' + val,
            datetimeFormatter: {
              year: 'yyyy',
              month: "MMM 'yy",
              day: 'dd MMM',
              hour: 'HH:mm'
            }
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: 1,
            width: '100%',
            offsetX: 0,
            offsetY: 0
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            height: 6,
            offsetX: 0,
            offsetY: 0
          },
          tickAmount: undefined,
          min: undefined,
          max: undefined,
          range: undefined,
          floating: false,
          position: 'bottom',
          title: {
            text: undefined,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              cssClass: 'apexcharts-xaxis-title'
            }
          },
          crosshairs: {
            show: true,
            width: 1,
            position: 'back',
            opacity: 0.9,
            stroke: {
              color: '#b6b6b6',
              width: 0,
              dashArray: 0
            },
            fill: {
              type: 'solid',
              color: '#B1B9C4',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            },
            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 1,
              opacity: 0.4
            }
          },
          tooltip: {
            enabled: true,
            formatter: (val) => 'Dia ' + val,
            offsetY: 0
          }
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
              formatter: (seriesName) => seriesName
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
        }
      },
      series: [{
        name: 'Total do dia',
        data: this.formatData(this.date, 'y')
      }]
    }
  },
  mounted () {
    const vue = this
    vue.series.push({
      name: 'Total Liquido',
      data: vue.formatData(vue.date, 'y', vue.getUser.percent)
    })
    vue.series.push({
      name: 'Porcentagem Barbeiro',
      data: vue.formatData(vue.date, 'y', vue.getUser.percent).map((value, index) => {
        return vue.series[0].data[index] - value
      })
    })
  },
  methods: {
    formatData (date, XY, percent) {
      const d = new Date(date)
      const days = Array.from({ length: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() })
      return days.map((day, index) => {
        return {
          x: (index + 1),
          y: this.getAmounthOfDay(index + 1, percent)
        }
      }).filter(({ y }) => y !== 0).map(obj => XY ? obj[XY] : obj)
    },

    getAmounthOfDay (day, percent) {
      const total = this.payments.filter(payment => {
        return new Date(payment.timestamp).toLocaleDateString() === new Date(String((new Date(this.date).getMonth() + 1) + '/' + day + '/' + new Date(this.date).getFullYear())).toLocaleDateString()
      })
        .reduce((acc, cur) => {
          return (acc + cur.service.price)
        }, 0.0)
      return percent ? parseInt(total - (total * (percent / 100))) : total
    },

    exportData (title) {
      const { XLSX, saveAs } = this.$xlsx
      const wb = XLSX.utils.book_new()
      wb.Props = {
        Title: 'Relatório ' + title,
        Subject: 'Relatório ' + title,
        Author: 'LS Barbearias',
        CreatedDate: new Date()
      }
      wb.SheetNames.push('Relatório ' + title)
      var data = this.formatDataToSheet()
      var ws = XLSX.utils.aoa_to_sheet(data)
      wb.Sheets['Relatório ' + title] = ws
      var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'Relatório ' + this.referer + '.xlsx')
    },

    formatDataToSheet () {
      const { percent } = this.getUser
      const header = ['Data', 'Rendimento Bruto', 'Rendimento Liquido', 'Porcentagem do Barbeiro']
      const body = this.formatData(this.date).map(({ x, y }) => {
        return [
          `${x}/${new Date(this.date).getMonth() + 1}/${new Date(this.date).getFullYear()}`,
          y.toFixed(2),
          parseFloat(y - (y * (percent / 100))).toFixed(2),
          parseFloat(y - (y - (y * (percent / 100)))).toFixed(2)
        ]
      })
      const sheet = [header, ...body]
      return sheet
    },

    s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }
  }
}
</script>

<style>
</style>
