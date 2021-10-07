<template>
  <div class="app-container">
    <div
      :id="id"
      :class="className"
      style="width: 100%;height: 85vh"
    />
  </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { getServerCpuUsage, getServerStats } from '@/api/server'

interface IWorkerStats {
  [key: string]: any
}

@Component({
  name: 'LineChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string

  private serverStats = { worker_num: 0 }
  private workerStats: IWorkerStats[] = []
  private lastData: Array<any> = []
  private text: string | (string | null)[] = ''
  private data_type = ''
  private title: Array<any> = []
  private labels: Array<any> = []
  private series: Array<any> = []
  private timer: any = null
  private animation = true
  private yAxisName = ''

  async mounted() {
    // 获取每秒数据
    for (let i = 0; i < 60; i++) {
      const second: string = i.toString() + 's'
      this.labels.push(second)
    }

    // 初始化折线图数据
    await this.getServerStats()
    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker_name: any = 'worker-' + i
      this.title.push(worker_name)
      // 初始化前一次数据
      this.lastData[worker_name] = []
      // 初始化数据
      this.workerStats[worker_name] = []
      for (let i = 0; i < this.labels.length; i++) {
        this.workerStats[worker_name].push(0)
      }
      // 初始化图表样式
      this.series.push({
        name: worker_name,
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        // symbolSize: 5,
        showSymbol: false,
        areaStyle: {
          opacity: 0.5
        },
        data: this.workerStats[worker_name]
      })
    }

    // 获取当前数据类型名称
    this.text = this.$route.query.type
    if (this.text === 'CPU Usage') {
      this.yAxisName = '%'
      await this.getServerCpuUsageData()
      // 设置定时器 每秒更新数据
      this.timer = setInterval(this.getServerCpuUsageData, 1000)
    } else {
      this.handleType(this.text)
      this.yAxisName = '(Count)'
      await this.getWorkerStateData()
      // 设置定时器 每秒更新数据
      this.timer = setInterval(this.getWorkerStateData, 1000)
    }

    this.$nextTick(() => {
      this.initChart()
    })
  }

  destroyed() {
    // 销毁定时器
    clearInterval(Number(this.timer))
  }

  private async getServerStats() {
    const { data } = await getServerStats('master')
    this.serverStats = data
  }

  private async getWorkerStateData() {
    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker_name: any = 'worker-' + i
      const { data } = await getServerStats(worker_name)

      if (this.lastData[worker_name].length !== 0) {
        // 推入最后一个数据
        this.workerStats[worker_name].push(
          data[this.data_type] - this.lastData[worker_name]
        )
        // 删除第一个数据
        this.workerStats[worker_name].shift()
      }
      // 记录上一次数据值
      this.lastData[worker_name] = data[this.data_type]
    }
    // 重新渲染图表
    this.animation = false // 关闭重绘上下波动问题
    this.setOptions()
  }

  private async getServerCpuUsageData() {
    const { data } = await getServerCpuUsage()
    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker_name: any = 'worker-' + i

      if (this.lastData[worker_name].length !== 0) {
        // 推入最后一个数据
        this.workerStats[worker_name].push(
          data[worker_name] - this.lastData[worker_name]
        )
        // 删除第一个数据
        this.workerStats[worker_name].shift()
      }
      // 记录上一次数据值
      this.lastData[worker_name] = data[worker_name]
      // 重新渲染图表
      this.animation = false // 关闭重绘上下波动问题
      this.setOptions()
    }
  }

  private handleType(type: any) {
    let str = ''
    switch (type) {
      case 'Request Count':
        str = 'worker_request_count'
        break
      case 'Dispatch Count':
        str = 'worker_dispatch_count'
        break
      case 'Response Count':
        str = 'worker_response_count'
        break
      default:
        str = 'worker_request_count'
    }
    this.data_type = str
  }

  /**
   * 初始化图表
   * @private
   */
  private initChart() {
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    this.setOptions()
  }

  /**
   * 设置图表
   * @private
   */
  private setOptions() {
    if (this.chart != null) {
      this.chart.setOption({
        animation: this.animation,
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: this.text,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.title,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: this.labels
        }],
        yAxis: [{
          type: 'value',
          name: this.yAxisName,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: this.series
      })
    }
  }
}

</script>
