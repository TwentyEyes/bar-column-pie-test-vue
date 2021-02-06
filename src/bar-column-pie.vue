<template>
    <section class="charts" :class="{'chart-overflow': overflow }">
      <h4 v-if="title" class="text-center">{{title | translate}}</h4>
        <div v-if="loading" class="loading" :style="{'top': loadingHeight}">
          <div id="circle_square">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div :style="[loading ? {'opacity': '0.2', 'pointer-events': 'none'} : {}]">
          <vue-highcharts v-if="reset" :Highcharts="Highcharts" :options="dataResults" :type="chartType" ref="drilldownChart"></vue-highcharts>
          <div class="switchChartContent" v-if="switchType">
            <div class="switchChart" >
              <a @click.prevent="changeType('bar')" href="" :class="{'active' : chartData.chart.type == 'bar'}"><span><i class="fas fa-align-left"></i></span>{{ 'bar_chart' | translate }}</a>
              <a @click.prevent="changeType('column')" href="" :class="{'active' : chartData.chart.type == 'column'}"><span><i class="fas fa-chart-bar"></i></span>{{ 'column_chart' | translate }}</a>
              <a @click.prevent="changeType('pie')" href="" :class="{'active' : chartData.chart.type == 'pie'}"><span><i class="fas fa-chart-pie"></i></span>{{ 'pie_chart' | translate }}</a>
          </div>
          </div>
        </div>
    </section>
</template>

<script>
import VueHighcharts from '../view/VueHighcharts.vue'
import Highcharts3D from 'highcharts/highcharts-3d'
import Drilldown from 'highcharts/modules/drilldown.js'
import Exporting from 'highcharts/modules/exporting'
import ExportingData from 'highcharts/modules/export-data'
import Highcharts from 'highcharts/highstock.js'
import chartMixins from '../mixins/mixins'
import { merge } from 'lodash'
 
Highcharts3D(Highcharts)
Exporting(Highcharts)
ExportingData(Highcharts)

if (!Highcharts.Chart.prototype.addSeriesAsDrilldown) {
  Drilldown(Highcharts)
}
Highcharts.createElement('link', {
  href: 'https://fonts.googleapis.com/css?family=Lato:300,400,700',
  rel: 'stylesheet',
  type: 'text/css'
}, null, document.getElementsByTagName('head')[0])

Highcharts.setOptions({
  lang: {
    drillUpText: '◁'
  }
})

export default {
  components: {
    VueHighcharts
  },
  mixins: [chartMixins],
  props: {
    series: {
      required: true
    },
    type: {
      default: 'bar',
      type: String
    },
    height: {
      default: 400,
      type: Number
    },
    drilldown: {
    },
    switchType: {
      default: false,
      type: Boolean
    },
    stacked: {
      default: false,
      type: Boolean
    },
    categories: {
      default: null,
      type: Array
    },
    radius: {
      default: false
    },
    title: String,
    subtitle: String,
    customOptions: {
      default: null,
      type: Object
    },
    customColors: {
      default: null
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  data () {
    let vm = this
    return {
      reset: true,
      overflow: false,
      dataResults: null,
      Highcharts: Highcharts,
      chartType: this.type,
      loadingHeight: 0,
      barHeight: 68,
      barTopPadding: 30,
      chartData: {
        chart: {
          type: 'bar',
          spacingTop: 40,
          spacingBottom: 40,
          height: vm.height,
          minHeight: 400,
          backgroundColor: null,
          style: {
            fontFamily: '"Lato", serif'
          },
          events: {
            drilldown: function (event) {
              let vm2 = this
              if (vm.type === 'bar' && vm2.series[0].data.length > 10) {
                if (event.point.index <= 3) {
                  vm.loadingHeight = (vm.barHeight * 3) + 'px'
                } else if (event.point.index >= vm2.series[0].data.length - 3) {
                  vm.loadingHeight = (((vm.barHeight * vm2.series[0].data.length) + vm.barTopPadding) - (vm.barHeight * 3)) + 'px'
                } else {
                  vm.loadingHeight = ((vm.barHeight * event.point.index) + vm.barTopPadding) + 'px'
                }
              } else {
                vm.loadingHeight = '50%'
              }
              vm.$emit('drilldown-click', [vm2, event, function (val) {
                  vm.calculateHeight(event, vm2, vm2)
                  vm.overflow = true
                  setTimeout(function() {
                    vm.overflow = false
                  }, 500)
              }])
              if (!vm.loading) vm.calculateHeight(event, vm2, vm2)
            },
            drillup: function (event) {
              let vm2 = this
              if (vm.type === 'bar' && event.seriesOptions.data.length > 10) {
                vm.loadingHeight = '250px'
              } else {
                vm.loadingHeight = '50%'
              }
              vm.$emit('drillup-click', [vm2, event, function (val) {
                vm.calculateHeight(event, vm, vm2)
                vm.overflow = true
                setTimeout(function() {
                  vm.overflow = false
                }, 500)
              }])
              if (!vm.loading) vm.calculateHeight(event, vm, vm2)
            },
            update: function (event) {
              let vm2 = this
              if (!vm.loading) vm.calculateHeight(event, vm2, vm2)
            },
            load: function (event) {
              let vm2 = this
              if (!vm.loading) vm.calculateHeight(event, vm2, vm2)
            }
          },
        },
        title: {
          text: '',
          style: {
            color: 'black',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        subtitle: {
          text: '',
          style: {
            color: '#444'
          }
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<div class="exa-chart-tooltip">' +
            '<table class="exa-chart-tooltip-table">',
          pointFormat: this.stacked ? '<tr>' +
            '<td><div class="exa-chart-tooltip-item-bullet" style="background-color: {point.color}"></div> {series.name} </td>' +
            '<td style="text-align: right"><b> {point.y:.2f} % </b></td></tr>'
            : '<td><div class="exa-chart-tooltip-item-bullet" style="background-color: {point.color}"></div> {point.name} </td>' +
            '<td style="text-align: right"><b> {point.y:.2f} % </b></td></tr>',
          footerFormat: '</table>',
          padding: 0,
          margin: 0,
          borderWidth: 0,
          backgroundColor: '#ffffff',
          borderRadius: 0,
          shadow: true,
          style: {
            padding: 0
          },
          positioner: function (labelWidth, labelHeight, point) {
            var tooltipX, tooltipY, chart
            chart = this.chart
            if (point.plotX + labelWidth > chart.plotWidth) {
              tooltipX = point.plotX + chart.plotLeft - labelWidth - 20
            } else {
              tooltipX = point.plotX + chart.plotLeft + 20
            }
            tooltipY = point.plotY + chart.plotTop - 20
            return {
              x: tooltipX,
              y: tooltipY
            }
          }
        },
        legend: {
          enabled: false,
          itemMarginTop: 0,
          margin: 20,
          itemStyle: {
            color: '#444',
            font: '12px Lato, sans-serif'
          },
          itemHiddenStyle: {
            color: '#999'
          }
        },
        credits: {
          enabled: false
        },
        xAxis: {
          type: 'category',
          lineWidth: 0,
          offset: 10,

          labels: {
            color: '#333',
            style: {
              fontFamily: 'Lato',
              fontWeight: 'bold',
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          opposite: false,
          crosshair: {
            width: 2,
            color: 'rgba(255,135,135,0.3)',
            dashStyle: 'dash',
            snap: false,
            label: {
              enabled: true,
              format: '{value:.2f}',
              backgroundColor: '#ff8787',
              borderRadius: 20,
              padding: 7,
              style: {
                color: '#fff',
                fontFamily: 'Avenir-Medium',
                fontWeight: 'bold',
                fontSize: '12px'
              }
            }
          },
          visible: false
        },
        navigation: {
          buttonOptions: {
            symbolStrokeWidth: 2,
            symbolStroke: '#bbb',
            symbolFill: '#fff',
            verticalAlign: 'bottom',
            y: 0
          },
          menuStyle: {
            background: '#fff',
            border: '0',
            borderRadius: '10px',
            fontFamily: 'Lato',
            fontSize: '11px',
            padding: '8px'

          },
          menuItemHoverStyle: {
            background: '#ee337c',
            color: '#fff'
          }
        },
        rangeSelector: {
          buttonTheme: {
            fill: 'white',
            stroke: '#C0C0C8',
            'stroke-width': 1,
            states: {
              select: {
                fill: '#D0D0D8'
              }
            }
          }
        },
        scrollbar: {
          trackBorderColor: '#C0C0C8'
        },
        plotOptions: {
          series: {
            events: {
              click: function (data) {
                vm.$emit('point-click', data.point)
              }
            },
            dataLabels: {
              enabled: true,
              style: {
                color: '#000',
                fontFamily: 'Lato',
                fontWeight: 'normal',
                fontSize: '11px',
                textOutline: '0px'
              },
              formatter: function () {
                if (vm.chartData.chart.type === 'pie') {
                  return this.point.name + ' ' + ':' + ' ' + this.point.y
                } else {
                  if (this.point.y >= 100 && !vm.stacked) {
                    return "<span style='color:green;font-weight:bold;font-size:12px'>" + this.point.y + '</span>'
                  } else {
                    return "<span style='color: #333333;font-size:12px'>" + this.point.y + '</span>'
                  }
                }
              }
            },
            point: {
              events: {
                click: function (data) {
                  if (vm.$refs.drilldownChart.chart.series[0].options.id !== undefined) {
                    vm.$emit('back-visibility', true)
                  }
                }
              }
            }
          }
        },
        series: [],
        drilldown: {
          activeAxisLabelStyle: {
            color: '#333',
            textDecoration: 'none'
          }
        },
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              symbol: 'menuball',
              menuItems: [
                'printChart',
                'separator',
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG',
                'downloadXLS'
              ]
            }
          }
        }
      }
    }
  },
  methods: {
    calculateHeight (event, value, value2) {
      let vm = this
      if (vm.chartType === 'bar') {
        function getChartHeight (seriesLength) {
            let itemHeight = 68,
            calculatedHeight = (seriesLength * itemHeight)
          if (Object.prototype.hasOwnProperty.call(vm.customOptions, 'chart') && Object.prototype.hasOwnProperty.call(vm.customOptions.chart, 'height') && !Object.prototype.hasOwnProperty.call(vm.customOptions.chart, 'minHeight')) {
            return vm.chartData.chart.height
          } else {
            let chartHeight = (calculatedHeight < vm.chartData.chart.minHeight) ? vm.chartData.chart.minHeight : calculatedHeight
            return chartHeight
          }
        }
        if (event.seriesOptions) {
          setTimeout(function () {
            value2.setSize(null, getChartHeight(event.seriesOptions.data.length))
          }, 0)
          setTimeout(function () {
            value2.setSize(null, getChartHeight(event.seriesOptions.data.length))
          }, 1000)
        } else {
          setTimeout(function () {
            if (Object.prototype.hasOwnProperty.call(value2, 'series')) value2.setSize(null, getChartHeight(value.series[0].data.length))
          }, 0)
          setTimeout(function () {
            if (Object.prototype.hasOwnProperty.call(value2, 'series')) value2.setSize(null, getChartHeight(value.series[0].data.length))
          }, 1000)
        }
      }
    },
    changeType (type) { // Change Chart Type (Pie - Column - Bar)
      let vm = this
      this.chartData.chart.type = type
      this.chartType = type
      this.$emit('switch-type', type)
      // this.$emit('switch-type', type)
      if (type === 'pie') {
        this.chartData.yAxis.crosshair.width = 0
        this.chartData.yAxis.crosshair.label.enabled = false
      } else {
        this.chartData.yAxis.crosshair.width = 2
        this.chartData.yAxis.crosshair.label.enabled = true
      }
      if (type !== 'bar') {
        this.chartData.chart.height = this.height
      } else {
        this.chartData.chart.height = this.series[0].data.length > 5 ? this.series[0].data.length * 68 : this.height
      }
      this.$emit('back-visibility', false)
      vm.reset = false
      this.$nextTick(function () {
        vm.reset = true
      })
    },
    back () { // Chart Back Button
      if (this.$refs.drilldownChart.chart.series[0].options.id !== undefined) {
        this.$refs.drilldownChart.chart.drillUp()
      }
      if (this.$refs.drilldownChart.chart.series[0].options.id == undefined) { // eslint-disable-line
        this.$emit('back-visibility', false)
      }
    },
    repeatArray (arr, count) {
      let ln = arr.length
      let b = []
      for (let i = 0; i < count; i++) {
        b.push(arr[i % ln])
      }
      return b
    },
    isDefined (foo) {
      return typeof foo !== 'undefined'
    }
  },
  mounted () {
    
    this.dataResults = merge(this.chartData, this.customOptions) // eslint-disable-line
    // Set Chart Data
    this.chartData.series = this.series
    this.chartData.xAxis.categories = this.categories
    this.chartData.chart.type = this.type
    this.chartData.subtitle.text = this.subtitle

    // Reset Pie Special Type
    if (this.chartData.chart.type === 'pie') {
      this.chartData.yAxis.crosshair.width = 0
      this.chartData.yAxis.crosshair.label.enabled = false
    }

    // Set Drilldown & Calculate Drilldown Height
    if (this.drilldown) {
      this.chartData.drilldown = this.drilldown
      // this.calculateDrilldownHeight(this.chartData)
    }

    let chartDataIndexZeroLength = this.chartData && this.chartData.series && this.chartData.series[0] && this.chartData.series[0].data.length ? this.chartData.series[0].data.length : 0
    let chartDataLength = this.series ? this.series.length : 0

    if (this.stacked && this.radius !== false) {
      for (let i in this.series) {
        this.series[i].borderRadius = this.radius
      }
    }

    // Set Custom colors in Props
    if (this.customColors) {
      let colors = this.customColors
      colors = this.repeatArray(colors, chartDataIndexZeroLength)
      if (this.stacked) {
        if (typeof this.customColors === 'string') {
          let color = this.customColors
          for (let i = 0; i < chartDataLength; i++) {
            this.series[i].color = color
            color = this.autoBrightness(color, '20')
          }
        } else {
          for (let i = 0; i < chartDataLength; i++) {
            this.series[i].color = colors[i]
          }
        }
      } else {
        if (typeof this.customColors === 'string') {
          let color = this.customColors
          for (let i = 0; i < chartDataIndexZeroLength; i++) {
            this.chartData.series[0].data[i].color = color
            color = this.autoBrightness(color, '20')
          }
        } else {
          for (let i = 0; i < chartDataIndexZeroLength; i++) {
            this.chartData.series[0].data[i].color = colors[i]
          }
        }
      }
    }
  }
}
</script>

<style>
  .loading {
    position: absolute;
    left: 50%
  }
  .charts {
    position: relative;
    background:#fff;
    border-radius: 4px;
  }
  .charts h4 {
    width: 100%;
    text-align: center;
    font-family: "AvenirNext-Medium";
    font-weight: bold;
    font-size: 18px;
    margin-bottom: -20px;
    margin-top: -20px;
  }
  .switchChartContent {
    width:100%;
    margin-top:20px;
    padding-bottom:20px;
  }
  .switchChartContent .switchChart{
    width: max-content;
      margin-left: auto;
      margin-right: auto;
  }
  .switchChartContent .switchChart a {
    margin-right:20px;
    color:#5b5b5b;
    font-size:16px;
    font-family: 'Avenir-Medium';
  }
  .switchChartContent .switchChart a span {
    margin-right:6px;
    display: inline-block;
    color:#5b5b5b;
    font-weight: 600;
  }
  .switchChartContent .switchChart a:hover {
    text-decoration: none;
    color:#ee337c;
  }
  .switchChartContent .switchChart a:hover span{
    color:#ee337c;
  }
  .switchChartContent .switchChart a.active {
    color:#ee337c;
  }
  .switchChartContent .switchChart a.active span {
     color:#ee337c;
  }

  @media only screen and (max-width: 768px) {
    .switchChartContent .switchChart {
        display:none;
    }
  }
</style>