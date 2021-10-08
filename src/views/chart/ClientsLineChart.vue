<template>
  <div
      :class="className"
      :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

export interface IClientsLineChartData {
  labels: string[]
  abort_count: number[]
  accept_count: number[]
  dispatch_count: number[]
  request_count: number[]
  response_count: number[]
  close_count: number[]
}

@Component({
  name: 'ClientsLineChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IClientsLineChartData
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '350px' }) private height!: string

  private animation = true

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: IClientsLineChartData) {
    this.animation = false
    this.setOptions(value)
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.setOptions(this.chartData)
  }

  private setOptions(chartData: IClientsLineChartData) {
    if (this.chart) {
      this.chart.setOption({
        animation: this.animation,
        xAxis: {
          data: chartData.labels,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff'
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['abort', 'accept', 'dispatch', 'request', 'response', 'close']
        },
        series: [{
          name: 'abort',
          smooth: true,
          type: 'line',
          itemStyle: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          },
          data: chartData.abort_count
        },
        {
          name: 'accept',
          smooth: true,
          type: 'line',
          itemStyle: {
            color: '#3888fa',
            lineStyle: {
              color: '#3888fa',
              width: 2
            },
            areaStyle: {
              color: '#f3f8ff'
            }
          },
          data: chartData.accept_count
        },
        {
          name: 'dispatch',
          smooth: true,
          type: 'line',
          data: chartData.dispatch_count
        },
        {
          name: 'request',
          smooth: true,
          type: 'line',
          data: chartData.request_count
        },
        {
          name: 'response',
          smooth: true,
          type: 'line',
          data: chartData.response_count
        },
        {
          name: 'close',
          smooth: true,
          type: 'line',
          data: chartData.close_count
        }
        ]
      })
    }
  }
}
</script>
