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

export interface IGaugeChartData {
  value: number
}

@Component({
  name: 'GaugeChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: IGaugeChartData
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: '100%' }) private width!: string
  @Prop({ default: '320px' }) private height!: string
  @Prop({ default: '' }) private name!: string

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: IGaugeChartData) {
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

  private setOptions(chartData: IGaugeChartData) {
    if (this.chart) {
      this.chart.setOption({
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 10
            },
            axisLine: {
              lineStyle: {
                width: 10
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              distance: 5,
              length: 10,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            axisLabel: {
              distance: 15,
              color: '#999',
              fontSize: 12
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 15,
              itemStyle: {
                borderWidth: 10
              }
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              fontSize: 24,
              borderRadius: 8,
              fontWeight: 'bolder',
              formatter: '{value}%',
              color: 'auto'
            },
            data: [
              {
                value: chartData,
                name: this.name
              }
            ]
          }
        ]
      })
    }
  }
}
</script>
