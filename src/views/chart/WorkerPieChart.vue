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

export interface IWorkerPieChartData {
  name: string
  labels: string[]
  data: number[]
}

@Component({
  name: 'WorkerPieChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IWorkerPieChartData
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '300px' }) private height!: string

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: IWorkerPieChartData) {
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

  private setOptions(chartData: IWorkerPieChartData) {
    if (this.chart) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: chartData.labels
        },
        series: [
          {
            name: chartData.name,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: chartData.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
