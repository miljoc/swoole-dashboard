<template>
  <div class="dashboard-editor-container">
    <panel-group @handle-set-line-chart-data="handleSetLineChartData" :serverStats="serverStats"/>

    <el-row :gutter="32">
      <el-col
          :xs="24"
          :sm="24"
          :lg="12"
      >
        <div class="chart-wrapper">
          <clients-line-chart :chart-data="clientsChartData"/>
        </div>
      </el-col>
      <el-col
          :xs="24"
          :sm="24"
          :lg="12"
      >
        <div class="chart-wrapper">
          <server-traffic-line-chart :chart-data="serverTrafficChartData"/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col
          :xs="12"
          :sm="12"
          :lg="4"
      >
        <div class="chart-wrapper">
          <div
              slot="header"
              class="clearfix"
          >
            <span>CPU Usage</span>
          </div>
          <gauge-chart ref="cpu_usage" width="300px" name="CPU Usage" height="280px" :chart-data="gaugeChartData"/>
        </div>
      </el-col>

      <el-col
          :xs="12"
          :sm="12"
          :lg="4"
      >
        <div class="chart-wrapper">
          <div
              slot="header"
              class="clearfix"
          >
            <span>Memory Usage</span>
          </div>
          <gauge-chart ref="qps" width="300px" height="280px" :chart-data="gaugeChartData2"/>
        </div>
      </el-col>

      <el-col
          :xs="24"
          :sm="24"
          :lg="8"
      >
        <div class="chart-wrapper">
          <worker-pie-chart :chart-data="workerPieChartData"/>
        </div>
      </el-col>
      <el-col
          :xs="24"
          :sm="24"
          :lg="8"
      >
        <div class="chart-wrapper">
          <bar-chart/>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Master Stats</span>
        </div>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
            <el-descriptions-item label="Current Session ID">{{ serverStats.session_round }}</el-descriptions-item>
            <el-descriptions-item label="Current Packet ID">{{ serverStats.pipe_packet_msg_id }}</el-descriptions-item>
            <el-descriptions-item label="Max FD">{{ serverStats.max_fd }}</el-descriptions-item>

            <el-descriptions-item label="Idle Event Worker Num">{{ serverStats.idle_worker_num }}</el-descriptions-item>
            <el-descriptions-item label="Idle Task Worker Num">{{ serverStats.task_idle_worker_num }}</el-descriptions-item>
            <el-descriptions-item label="Tasking Num"> {{ serverStats.tasking_num }}</el-descriptions-item>

            <el-descriptions-item label="Event Worker Num">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/processes?tab=worker`}"> {{ serverStats.worker_num }}
                </router-link>
              </el-link>
            </el-descriptions-item>

            <el-descriptions-item label="Task Worker Num">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/processes?tab=task_worker`}"> {{ serverStats.task_worker_num }}
                </router-link>
              </el-link>
            </el-descriptions-item>

            <el-descriptions-item label="User Worker Num">
              {{ serverStats.user_worker_num }}
            </el-descriptions-item>

          </el-descriptions>
        </div>
      </el-card>
    </el-row>

    <el-row>
      <el-card class="box-card" style="margin-top: 20px">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Worker Stats</span>
        </div>

        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
          </el-descriptions>
        </div>
        <el-table
            :data="workerStats"
            border
            fit
            highlight-current-row
            width="100%"
        >
          <el-table-column
              align="center"
              label="Worker ID"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_id }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Dispatch Count"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_request_count }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Request Count"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_dispatch_count }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Coroutine Num"
          >
            <template slot-scope="{row}">

              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/coroutines/worker-${row.worker_id}`}">{{ row.coroutine_num }}
                </router-link>
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Coroutine Peek Num"
          >
            <template slot-scope="{row}">
              <span>{{ row.coroutine_peek_num }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-row>
    <el-row>
      <el-card class="box-card" style="margin-top: 20px">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Ports</span>
        </div>

        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
          </el-descriptions>
        </div>
        <el-table
            :data="ports"
            border
            fit
            highlight-current-row
            width="100%"
        >
          <el-table-column
              align="center"
              label="Host"
          >
            <template slot-scope="{row}">
              <span>{{ row.host }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Port"
          >
            <template slot-scope="{row}">
              <span>{{ row.port }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Type"
          >
            <template slot-scope="{row}">
              <span>{{ row.type | socketTypeFilter(row.ssl) }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Potocols"
          >
            <template slot-scope="{row}">
              <span>{{ row.protocols }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Backlog"
          >
            <template slot-scope="{row}">
              <span>{{ row.backlog }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Connection Num"
          >
            <template slot-scope="{row}">
              <span>{{ row.connection_num }}</span>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-row>

  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue, Watch } from 'vue-property-decorator'
import GithubCorner from '@/components/GithubCorner/index.vue'
import BarChart from './components/BarChart.vue'
import BoxCard from './components/BoxCard.vue'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import PanelGroup from './components/PanelGroup.vue'
import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
import TodoList from './components/TodoList/index.vue'
import GaugeChart from './components/GaugeChart.vue'
import TransactionTable from './components/TransactionTable.vue'
import ClientsLineChart, { IClientsLineChartData } from '@/views/chart/ClientsLineChart.vue'
import { getServerStats, getAllPorts } from '@/api/server'
import { parseTime, bytesFormat, socketTypeFilter } from '@/utils'
import { IServerStats } from '@/api/types'
import ServerTrafficLineChart, { IServerTrafficLineChart } from '@/views/chart/ServerTrafficLineChart.vue'
import WorkerPieChart, { IWorkerPieChartData } from '@/views/chart/WorkerPieChart.vue'

const lineChartData: { [type: string]: ILineChartData } = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

@Component({
  name: 'DashboardAdmin',
  components: {
    WorkerPieChart,
    ServerTrafficLineChart,
    GaugeChart,
    GithubCorner,
    BarChart,
    BoxCard,
    LineChart,
    PanelGroup,
    PieChart,
    RadarChart,
    TodoList,
    TransactionTable,
    ClientsLineChart
  },
  filters: {
    parseTime: parseTime,
    bytesFormat: bytesFormat,
    socketTypeFilter: socketTypeFilter
  }
})
export default class extends Vue {
  private lineChartData = lineChartData.newVisitis
  private clientsChartData: IClientsLineChartData = {
    labels: [],
    abort_count: [],
    accept_count: [],
    dispatch_count: [],
    request_count: [],
    response_count: [],
    close_count: []
  }

  private serverTrafficChartData: IServerTrafficLineChart = {
    labels: [],
    recvData: [],
    sendData: []
  }

  private workerPieChartData: IWorkerPieChartData = {
    name: 'Dispatch Count',
    labels: [],
    data: []
  }

  private gaugeChartData = 0
  private gaugeChartData2 = 0
  private serverStats: IServerStats = {
    abort_count: -1,
    close_count: -1,
    accept_count: -1,
    connection_num: -1,
    coroutine_num: -1,
    dispatch_count: -1,
    idle_worker_num: -1,
    request_count: -1,
    response_count: -1,
    start_time: -1,
    task_worker_num: -1,
    tasking_num: -1,
    worker_dispatch_count: -1,
    worker_num: -1,
    worker_request_count: -1
  }

  private workerStats = []
  private ports = []
  private timer_1: any
  private timer_2: any

  created() {
    for (let i = 0; i < 60; i++) {
      this.clientsChartData.labels.push(i.toString() + 's')
      this.clientsChartData.abort_count.push(0)
      this.clientsChartData.accept_count.push(0)
      this.clientsChartData.dispatch_count.push(0)
      this.clientsChartData.request_count.push(0)
      this.clientsChartData.response_count.push(0)
      this.clientsChartData.close_count.push(0)

      this.serverTrafficChartData.labels.push(i.toString() + 's')
      this.serverTrafficChartData.recvData.push(0)
      this.serverTrafficChartData.sendData.push(0)
    }
    this.getData()
    this.timer_1 = setInterval(this.updateData, 1000)
    this.timer_2 = setInterval(this.getData, 10000)
  }

  destroyed() {
    clearInterval(this.timer_1)
    clearInterval(this.timer_2)
  }

  private async updateData() {
    this.gaugeChartData = getRandomInt(5, 95)
    this.gaugeChartData2 = getRandomInt(5, 95)

    const lastServerStats = this.serverStats
    await this.getServerStats()

    this.clientsChartData.abort_count.push(this.serverStats.abort_count - lastServerStats.abort_count)
    this.clientsChartData.accept_count.push(this.serverStats.accept_count - lastServerStats.accept_count)
    this.clientsChartData.request_count.push(this.serverStats.request_count - lastServerStats.request_count)
    this.clientsChartData.dispatch_count.push(this.serverStats.dispatch_count - lastServerStats.dispatch_count)
    this.clientsChartData.response_count.push(this.serverStats.response_count - lastServerStats.response_count)
    this.clientsChartData.close_count.push(this.serverStats.close_count - lastServerStats.close_count)

    this.clientsChartData.abort_count.shift()
    this.clientsChartData.accept_count.shift()
    this.clientsChartData.request_count.shift()
    this.clientsChartData.dispatch_count.shift()
    this.clientsChartData.response_count.shift()
    this.clientsChartData.close_count.shift()

    this.serverTrafficChartData.recvData.push(this.serverStats.total_recv_bytes - lastServerStats.total_recv_bytes)
    this.serverTrafficChartData.sendData.push(this.serverStats.total_send_bytes - lastServerStats.total_send_bytes)
    this.serverTrafficChartData.recvData.shift()
    this.serverTrafficChartData.sendData.shift()
  }

  private handleSetLineChartData(type: string) {
    this.lineChartData = lineChartData[type]
  }

  private async getServerStats() {
    const { data } = await getServerStats('master')
    this.serverStats = data
  }

  private async getData() {
    const { data } = await getServerStats('master')
    this.serverStats = data

    let workerStats = []
    let workerPieChartData = {
      name: this.workerPieChartData.name,
      data: [],
      labels: []
    }

    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker_name = 'worker-' + i
      const { data } = await getServerStats(worker_name)

      workerStats.push({
        worker_id: i,
        worker_request_count: data.worker_request_count,
        worker_dispatch_count: data.worker_dispatch_count,
        coroutine_num: data.coroutine_num,
        coroutine_peek_num: data.coroutine_peek_num
      })

      workerPieChartData.labels.push(worker_name)
      workerPieChartData.data.push({
        value: data.worker_dispatch_count,
        name: worker_name
      })
    }

    this.workerStats = workerStats
    this.workerPieChartData = workerPieChartData

    do {
      const { data } = await getAllPorts()
      this.ports = data
    } while (0)
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
