<template>
  <div class="dashboard-editor-container">
    <panel-group :serverStats="serverStats"/>

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

    <el-row :gutter="24">
      <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="6"
      >
        <div class="chart-wrapper">
          <div
              slot="header"
              class="clearfix"
          >
            <span>CPU Usage</span>
          </div>
          <gauge-chart ref="cpu_usage" width="100%" :max="cpuUsageMax" name="CPU Usage" height="280px" :chart-data="cpuUsage"/>
        </div>
      </el-col>

      <el-col
          :xs="12"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="6"
      >
        <div class="chart-wrapper">
          <div
              slot="header"
              class="clearfix"
          >
            <span>Memory Usage</span>
          </div>
          <memory-usage-chart ref="qps" width="100%" height="280px" :max="memoryUsageMax" :chart-data="memoryUsage"/>
        </div>
      </el-col>

      <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="6"
      >
        <div class="chart-wrapper">
          <worker-pie-chart :chart-data="workerPieChartData"/>
        </div>
      </el-col>
      <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="6"
      >
        <div class="chart-wrapper">
          <worker-bar-chart :chart-data="workerBarChartData"/>
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
            <el-descriptions-item label="Current Session ID">{{ serverStats.session_round | amountRule }}</el-descriptions-item>
            <el-descriptions-item label="Current Packet ID">{{ serverStats.pipe_packet_msg_id | amountRule }}</el-descriptions-item>
            <el-descriptions-item label="Max FD">{{ serverStats.max_fd | amountRule }}</el-descriptions-item>

            <el-descriptions-item label="Idle Event Worker Num">{{ serverStats.idle_worker_num }}</el-descriptions-item>
            <el-descriptions-item label="Idle Task Worker Num">{{ serverStats.task_idle_worker_num }}</el-descriptions-item>
            <el-descriptions-item label="Tasking Num"> {{ serverStats.tasking_num === undefined ? 0 : serverStats.tasking_num | amountRule }}</el-descriptions-item>

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
              label="CPU Usage"
          >
            <template slot-scope="{row}">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/worker_states?type=CPU Usage`}">{{ workerCpuUsage[row.worker_id] }}%
                </router-link>
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Request Count"
          >
            <template slot-scope="{row}">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/worker_states?type=Request Count`}">{{ row.worker_dispatch_count | amountRule }}
                </router-link>
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Dispatch Count"
          >
            <template slot-scope="{row}">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/worker_states?type=Dispatch Count`}">{{ row.worker_request_count | amountRule }}
                </router-link>
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Response Count"
          >
            <template slot-scope="{row}">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/worker_states?type=Dispatch Count`}">{{ row.worker_response_count | amountRule }}
                </router-link>
              </el-link>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Coroutine Num"
          >
            <template slot-scope="{row}">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/coroutines/?worker=worker-${row.worker_id}`}">{{ row.coroutine_num }}
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
import { Component, Vue } from 'vue-property-decorator'
import GithubCorner from '@/components/GithubCorner/index.vue'
import BarChart from './components/BarChart.vue'
import BoxCard from './components/BoxCard.vue'
import PanelGroup from './components/PanelGroup.vue'
import PieChart from './components/PieChart.vue'
import RadarChart from './components/RadarChart.vue'
import TodoList from './components/TodoList/index.vue'
import GaugeChart from './components/GaugeChart.vue'
import ClientsLineChart, { IClientsLineChartData } from '@/views/chart/ClientsLineChart.vue'
import { getServerStats, getAllPorts, getServerCpuUsage, getServerMemoryUsage, getWorkerInfo2 } from '@/api/server'
import { parseTime, bytesFormat, socketTypeFilter, amountRule } from '@/utils'
import { IServerStats } from '@/api/types'
import ServerTrafficLineChart, { IServerTrafficLineChart } from '@/views/chart/ServerTrafficLineChart.vue'
import WorkerPieChart, { IWorkerPieChartData } from '@/views/chart/WorkerPieChart.vue'
import MemoryUsageChart from '@/views/chart/MemoryUsageChart.vue'
import WorkerBarChart, { IWorkerBarChartData } from '@/views/chart/WorkerBarChart.vue'

// function getRandomInt(min: number, max: number) {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

@Component({
  name: 'SwooleDashboard',
  components: {
    WorkerBarChart,
    MemoryUsageChart,
    WorkerPieChart,
    ServerTrafficLineChart,
    GaugeChart,
    GithubCorner,
    BarChart,
    BoxCard,
    PanelGroup,
    PieChart,
    RadarChart,
    TodoList,
    ClientsLineChart
  },
  filters: {
    parseTime: parseTime,
    bytesFormat: bytesFormat,
    socketTypeFilter: socketTypeFilter,
    amountRule: amountRule
  }
})
export default class extends Vue {
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

  private workerBarChartData: IWorkerBarChartData = {
    labels: [],
    coroutine_data: [],
    event_data: [],
    timer_data: [],
    object_data: []
  }

  private lastCpuUsage = 0
  private cpuUsage = 0
  private workerCpuUsage: number[] = []
  private lastWorkerCpuUsage: number[] = []
  private cpuUsageMax = 100

  private memoryUsage = 0
  private memoryUsageMax = 100

  private serverStats: IServerStats = {
    session_round: 0,
    pipe_packet_msg_id: 0,
    max_fd: 0,
    task_idle_worker_num: 0,
    abort_count: 0,
    close_count: 0,
    accept_count: 0,
    connection_num: 0,
    coroutine_num: 0,
    dispatch_count: 0,
    idle_worker_num: 0,
    request_count: 0,
    response_count: 0,
    start_time: 0,
    task_worker_num: 0,
    tasking_num: 0,
    worker_dispatch_count: 0,
    worker_num: 0,
    worker_request_count: 0,
    worker_response_count: 0,
    user_worker_num: 0,
    total_recv_bytes: 0,
    total_send_bytes: 0
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
    this.getHighFrequencyData()
    this.getLowFrequencyData()
    this.timer_1 = setInterval(this.getHighFrequencyData, 1000)
    this.timer_2 = setInterval(this.getLowFrequencyData, 10000)
  }

  destroyed() {
    clearInterval(this.timer_1)
    clearInterval(this.timer_2)
  }

  private async getHighFrequencyData() {
    const lastServerStats = this.serverStats
    await this.getServerStats()
    await this.getCpuUsage()

    if (lastServerStats.worker_num > 0) {
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
  }

  private async getCpuUsage() {
    const lastCpuUsage = this.lastCpuUsage
    const { data } = await getServerCpuUsage()
    this.lastCpuUsage = data.total
    this.cpuUsage = this.lastCpuUsage - lastCpuUsage
    this.cpuUsageMax = data.cpu_num * 100

    const lastWorkerCpuUsage = this.lastWorkerCpuUsage
    for (let i = 0; i < this.serverStats.worker_num; i++) {
      lastWorkerCpuUsage.push(0)
    }

    const workerCpuUsage = []
    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker = 'worker-' + i
      workerCpuUsage.push(data[worker] - lastWorkerCpuUsage[i])
      lastWorkerCpuUsage[i] = data[worker]
    }
    this.lastWorkerCpuUsage = lastWorkerCpuUsage
    this.workerCpuUsage = workerCpuUsage
  }

  private async getMemoryUsage() {
    const { data } = await getServerMemoryUsage()
    this.memoryUsage = data.total
    this.memoryUsageMax = data.memory_size
  }

  private async getServerStats() {
    try {
      const { data } = await getServerStats('master')
      this.serverStats = data
    } catch (e) {
      clearInterval(this.timer_1)
      clearInterval(this.timer_2)
      this.$message({
        message: this.$t('common.networkError') as string,
        type: 'warning'
      })
    }
  }

  private async getLowFrequencyData() {
    await this.getMemoryUsage()

    if (this.serverStats.worker_num <= 0) {
      const { data } = await getServerStats('master')
      this.serverStats = data
    }

    const workerStats: any = []
    const workerPieChartData: IWorkerPieChartData = {
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
        worker_response_count: data.worker_response_count,
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

    const workerBarChartData: IWorkerBarChartData = {
      labels: [],
      coroutine_data: [],
      event_data: [],
      timer_data: [],
      object_data: []
    }

    do {
      const { data } = await getWorkerInfo2('master')
      if (data.vm_status === undefined) {
        data.vm_status = {
          object_num: 0
        }
      }
      workerBarChartData.labels.push('master')
      workerBarChartData.coroutine_data.push(data.coroutine_stats.coroutine_num)
      workerBarChartData.event_data.push(data.coroutine_stats.event_num)
      workerBarChartData.timer_data.push(data.timer_stats.num)
      workerBarChartData.object_data.push(data.vm_status.object_num)
    } while (0)

    for (let i = 0; i < this.serverStats.worker_num; i++) {
      const worker_name = 'worker-' + i
      const { data } = await getWorkerInfo2(worker_name)
      if (data.vm_status === undefined) {
        data.vm_status = {
          object_num: 0
        }
      }
      workerBarChartData.labels.push(worker_name)
      workerBarChartData.coroutine_data.push(data.coroutine_stats.coroutine_num)
      workerBarChartData.event_data.push(data.coroutine_stats.event_num)
      workerBarChartData.timer_data.push(data.timer_stats.num)
      workerBarChartData.object_data.push(data.vm_status.object_num)
    }

    for (let i = 0; i < this.serverStats.task_worker_num; i++) {
      const { data } = await getWorkerInfo2('task_worker-' + i)
      if (data.vm_status === undefined) {
        data.vm_status = {
          object_num: 0
        }
      }
      workerBarChartData.labels.push('task-worker-' + i)
      workerBarChartData.coroutine_data.push(data.coroutine_stats.coroutine_num)
      workerBarChartData.event_data.push(data.coroutine_stats.event_num)
      workerBarChartData.timer_data.push(data.timer_stats.num)
      workerBarChartData.object_data.push(data.vm_status.object_num)
    }

    this.workerBarChartData = workerBarChartData

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
