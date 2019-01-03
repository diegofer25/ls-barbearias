<template>
  <div class="row justify-around">
    <div class="col-12"  v-if="payments.length">
      <q-card class="shadow-8 q-pa-sm">
        <div class="row">
          <div class="col-12">
            <apexchart width="100%" height="500px" type="bar" :options="options" :series="series"></apexchart>
          </div>
        </div>
        <div class="toolbar">
          <div class="row justify-end">
            <q-btn @click.stop="exportData('Serviços')" color="secondary">EXPORTAR PARA EXEL</q-btn>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'services-chart',
  props: [
    'payments',
    'date'
  ],
  computed: {
    ...mapGetters('application', ['getUser'])
  },
  data () {
    const vue = this
    return {
      options: {
        chart: {
          stacked: true,
          stackType: '100%'
        },
        title: {
          text: 'Percentual de receita por serviço',
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
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        legend: {
          position: 'bottom',
          offsetX: 0,
          offsetY: 0,
          floating: false
        },
        xaxis: {
          type: 'category',
          categories: vue.formatData(vue.date, 'x'),
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
        yaxis: {
          min: 0,
          max: 100,
          show: true,
          seriesName: 'Percentual Dia (%)',
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
            text: 'Percentual Dia (%)',
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
            enabled: true
          }
        },
        tooltip: {
          enabled: true,
          followCursor: true,
          intersect: false,
          inverseOrder: false,
          custom: undefined,
          fillSeriesColor: false,
          onDatasetHover: {
            highlightDataSeries: true
          },
          y: {
            formatter: val => 'R$ ' + val.toFixed(2),
            title: {
              formatter: (seriesName, opt) => {
                const executions = vue.payments.filter(p => {
                  return p.service.name === seriesName.replace(':', '') &&
                  new Date(p.timestamp).getDate() === opt.w.config.xaxis.categories[opt.dataPointIndex]
                })
                const brut = executions.reduce((acc, cur) => (acc + cur.service.price), 0.00)
                return `<strong class="q-subheading">${seriesName}</strong >
                        <br>
                        <span>Quantidade: <b>${executions.length}</b></span>
                        <br>
                        <span>Receita Bruta: <b>R$ ${brut.toFixed(2)}</b></span>
                        <br>
                        <span>Receita Liquida</span>`
              }
            }
          },
          marker: {
            show: true
          },
          items: {
            display: 'flex'
          }
        },
        fill: {
          opacity: 1
        }
      },
      series: []
    }
  },
  mounted () {
    const vue = this
    const services = []
    vue.payments.map(payment => {
      if (services.every(p => {
        return p.service.name !== payment.service.name
      })) services.push(payment)
    })
    vue.series = services.map(payment => {
      return {
        name: payment.service.name,
        data: vue.formatData(vue.date, 'date').map(day => {
          const { percent } = vue.getUser
          const total = vue.payments.filter(p => {
            return p.service.name === payment.service.name && new Date(p.timestamp).toLocaleDateString() === day
          }).reduce((acc, cur) => {
            return (acc + cur.service.price)
          }, 0.0)
          return percent ? parseInt(total - (total * (percent / 100))) : total
        })
      }
    })
  },
  methods: {
    formatData (date, XY, percent) {
      const d = new Date(date)
      const days = Array.from({ length: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() })
      return days.map((day, index) => {
        return {
          x: (index + 1),
          y: this.getAmounthOfDay(index + 1, percent),
          date: new Date(d.getFullYear(), d.getMonth(), (index + 1)).toLocaleDateString()
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
      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'Relatório ' + title + '.xlsx')
    },

    formatDataToSheet () {
      const header = ['Data', 'Serviço', 'Preço']
      const body = this.payments.map(payment => {
        return [
          new Date(payment.timestamp).toLocaleDateString(),
          payment.service.name,
          payment.service.price.toFixed(2)
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
