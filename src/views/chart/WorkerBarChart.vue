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

export interface IWorkerBarChartData {
  labels: string[]
  coroutine_data: number[]
  event_data: number[]
  timer_data: number[]
  object_data: number[]
}

@Component({
  name: 'BarChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IWorkerBarChartData
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: IWorkerBarChartData) {
    this.setOptions()
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
    this.setOptions()
  }

  private setOptions() {
    if (!this.chart) {
      return
    }
    this.chart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 10,
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: this.chartData.labels,
        minInterval: 1,
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value',
        axisTick: {
          show: false
        }
      }],
      series: [{
        name: 'Coroutine',
        type: 'bar',
        stack: 'vistors',
        data: this.chartData.coroutine_data
      }, {
        name: 'Event',
        type: 'bar',
        stack: 'vistors',
        data: this.chartData.event_data
      }, {
        name: 'Timer',
        type: 'bar',
        stack: 'vistors',
        data: this.chartData.timer_data
      }, {
        name: 'Object',
        type: 'bar',
        stack: 'vistors',
        data: this.chartData.object_data
      }]
    })
  }
}
</script>
