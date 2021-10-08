<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix"
        >
          <span>Worker Stats</span>
        </div>
        <div class="small" style="width: 90%; height: 80%; margin: 0 auto">
          <canvas ref="canvas"/>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import Chart from 'chart.js'
import { getServerCpuUsage, getServerStats } from '@/api/server'

interface IWorkerStats {
  [key: string]: any
}

@Component({
  name: 'LineChart',
  components: {}
})

export default class extends Vue {
  @Prop({ default: 'chart' }) private className!: string
  @Prop({ default: 'chart' }) private id!: string

  private serverStats = { worker_num: 0 }
  private workerStats: IWorkerStats[] = []
  private lastData: Array<any> = []
  private text: any = ''
  private data_type = ''
  private title: Array<any> = []
  private labels: Array<any> = []
  private series: Array<any> = []
  private timer: any = null
  private animation = true
  private yAxisName = ''

  private ctx: any
  private chart: any
  private color = [
    {
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)'
    },
    {
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgb(75, 192, 192)'
    },
    {
      backgroundColor: '#80FFA5',
      borderColor: '#80FFA5'
    },
    {
      backgroundColor: '#00DDFF',
      borderColor: '#00DDFF'
    },
    {
      backgroundColor: '#37A2FF',
      borderColor: '#37A2FF'
    },
    {
      backgroundColor: '#FF0087',
      borderColor: '#FF0087'
    },
    {
      backgroundColor: '#FFBF00',
      borderColor: '#FFBF00'
    }
  ]

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
        label: worker_name,
        data: this.workerStats[worker_name],
        backgroundColor: this.color[i % 7].backgroundColor,
        borderColor: this.color[i % 7].borderColor,
        fill: false
      })
    }

    // 获取当前数据类型名称
    this.text = this.$route.query.type
    if (this.text === 'CPU Usage') {
      this.yAxisName = '%'
      await this.getServerCpuUsageData()
    } else {
      this.handleType(this.text)
      this.yAxisName = '(Count)'
      await this.getWorkerStateData()
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
    this.labels.push(this.labels.shift())
    if (this.chart !== undefined) {
      this.chart.update()
    }
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
    }

    // 重新渲染图表
    this.labels.push(this.labels.shift())
    if (this.chart !== undefined) {
      this.chart.update()
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
    this.ctx = (this.$refs.canvas as any).getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.series
      },
      options: {
        // responsive: true,
        title: {
          display: true,
          text: this.text
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              stepSize: 1,
              suggestedMin: 0,
              beginAtZero: true
            }
          }]
        }
      }
    })

    if (this.text === 'CPU Usage') {
      // 设置定时器 每秒更新数据
      this.timer = setInterval(this.getServerCpuUsageData, 1000)
    } else {
      // 设置定时器 每秒更新数据
      this.timer = setInterval(this.getWorkerStateData, 1000)
    }
    // this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    // this.setOptions()
  }

  /**
   * 设置图表
   * @private
   */
  private setOptions() {
    if (this.chart != null) {
      this.chart.setOption({
        animation: this.animation,
        title: {
          left: 'center',
          text: this.text,
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          top: 35,
          icon: 'rect',
          itemWidth: 50,
          itemHeight: 16
        },
        xAxis: [{
          data: this.labels
        }],
        yAxis: [{

        }],
        series: this.series
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@mixin colorBtn($color) {
  background: $color;
  &:hover {
    color: $color;

    &:before,
    &:after {
      background: $color;
    }
  }
}

.blue-btn {
  @include colorBtn($blue)
}

.light-blue-btn {
  @include colorBtn($light-blue)
}

.red-btn {
  @include colorBtn($red)
}

.pink-btn {
  @include colorBtn($pink)
}

.green-btn {
  @include colorBtn($green)
}

.tiffany-btn {
  @include colorBtn($tiffany)
}

.yellow-btn {
  @include colorBtn($yellow)
}

.pan-btn {
  font-size: 14px;
  color: #fff;
  padding: 14px 36px;
  border-radius: 8px;
  border: none;
  outline: none;
  transition: 600ms ease all;
  position: relative;
  display: inline-block;

  &:hover {
    background: #fff;

    &:before,
    &:after {
      width: 100%;
      transition: 600ms ease all;
    }
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 2px;
    width: 0;
    transition: 400ms ease all;
  }

  &::after {
    right: inherit;
    top: inherit;
    left: 0;
    bottom: 0;
  }
}

.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.component-item {
  min-height: 100px;
}
</style>
