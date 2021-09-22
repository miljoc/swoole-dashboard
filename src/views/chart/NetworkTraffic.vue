<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Connection #{{ $route.query.session_id }} Network Traffic</span>
        </div>
        <div class="small" style="width: 90%; height: 80%; margin: 0 auto">
          <canvas ref="canvas"/>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import Chart, { ChartData, ChartOptions } from 'chart.js'
import { IConnectionInfo, IServerSetting, IWorkerCoroutineData } from '@/api/types'
import { getConnectionInfo, getServerSetting } from '@/api/server'
import { bytesFormat } from '@/utils/index'

@Component({
  name: 'NetworkTraffic',
  components: {}
})

export default class extends Vue {
  private _timer: any
  private ctx: any
  private chart: any
  private dataLabels: string[] = []
  private connectionInfo: IConnectionInfo = {
    total_recv_bytes: 0,
    total_send_bytes: 0,
    session_id: 0
  }

  private dataRecvTraffic: number[] = []
  private dataSendTraffic: number[] = []
  private maxY = 0
  private config = {
    type: 'line',
    data: {
      labels: this.dataLabels,
      datasets: [
        {
          label: 'recv',
          data: this.dataRecvTraffic,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          fill: false
        },
        {
          label: 'send',
          data: this.dataSendTraffic,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgb(75, 192, 192)',
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Network Traffic'
      },
      scales: {
        yAxes: [{
          display: true,
          ticks: {
            stepSize: 1024,
            suggestedMin: 0,
            beginAtZero: true,
            callback: function(value: number, index: number, values: any) {
              return bytesFormat(value)
            }
          }
        }]
      }
    }
  }

  private serverSetting: IServerSetting = {
    mode: 0,
    reactor_num: 0,
    manager_pid: 0,
    task_worker_num: 0,
    worker_num: 0,
    master_pid: 0
  }

  created() {
    for (let i = 0; i < 60; i++) {
      this.dataLabels.push(i.toString() + 's')
      this.dataRecvTraffic.push(0)
      this.dataSendTraffic.push(0)
    }
    this.getData()
  }

  private async getData() {
    const { data } = await getServerSetting()
    this.serverSetting = data
    await this.getConnectionInfo()
  }

  private async getConnectionInfo() {
    const process = this.serverSetting.mode === 1 ? 'worker-' + this.$route.query.reactor_id : 'reactor-' + this.$route.query.reactor_id
    const session_id: number = parseInt(String(this.$route.query.session_id), 10)
    const { data } = await getConnectionInfo(process, session_id)
    this.connectionInfo = data
  }

  mounted() {
    this.ctx = (this.$refs.canvas as any).getContext('2d')
    this.chart = new Chart(this.ctx, this.config)
    this._timer = setInterval(this.display, 1000)
  }

  destroyed() {
    clearTimeout(this._timer)
  }

  private async display() {
    const last_info = this.connectionInfo
    await this.getConnectionInfo()

    const last = parseInt(this.dataLabels[this.dataLabels.length - 1])
    let label = last + 1
    if (last >= 59) {
      label = 0
    }
    this.dataLabels.push(label.toString() + 's')

    const recv_bytes = this.connectionInfo.total_recv_bytes - last_info.total_recv_bytes
    const send_bytes = this.connectionInfo.total_send_bytes - last_info.total_send_bytes

    if (recv_bytes > this.maxY) {
      this.maxY = recv_bytes
    }
    if (send_bytes > this.maxY) {
      this.maxY = send_bytes
    }

    const tmpStepSize = this.maxY / 10
    let stepSize = 1
    let index = 1
    while (stepSize < tmpStepSize) {
      stepSize = Math.pow(2, index++)
    }
    this.config.options.scales.yAxes[0].ticks.stepSize = stepSize

    this.dataRecvTraffic.push(recv_bytes)
    this.dataSendTraffic.push(send_bytes)

    this.dataLabels.shift()
    this.dataRecvTraffic.shift()
    this.dataSendTraffic.shift()

    this.chart.update()
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
