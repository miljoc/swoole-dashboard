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
import { bytesFormat } from '@/utils/index'

export interface IServerTrafficLineChart {
  labels: string[]
  recvData: number[]
  sendData: number[]
}

@Component({
  name: 'ServerTrafficLineChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IServerTrafficLineChart
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '350px' }) private height!: string

  private animation = true

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: IServerTrafficLineChart) {
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

  private setOptions(chartData: IServerTrafficLineChart) {
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
            show: true
          },
          axisLabel: {
            show: true,
            formatter: function(value: number) {
              return bytesFormat(value)
            }
          }
        },
        legend: {
          data: ['recv', 'send']
        },
        series: [{
          name: 'recv',
          itemStyle: {
            color: '#FF005A',
            lineStyle: {
              color: '#FF005A',
              width: 2
            }
          },
          smooth: true,
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
          data: chartData.recvData
        },
        {
          name: 'send',
          smooth: true,
          type: 'line',
          symbol: 'circle',
          symbolSize: 5,
          showSymbol: false,
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
          data: chartData.sendData
        }]
      })
    }
  }
}
</script>
