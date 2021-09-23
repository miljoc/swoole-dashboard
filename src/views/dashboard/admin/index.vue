<template>
  <div class="dashboard-editor-container">
    <panel-group @handle-set-line-chart-data="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <el-row :gutter="32">
      <el-col
          :xs="24"
          :sm="24"
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
          :xs="24"
          :sm="24"
          :lg="4"
      >
        <div class="chart-wrapper">
          <div
              slot="header"
              class="clearfix"
          >
            <span>CPU Usage</span>
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
          <pie-chart />
        </div>
      </el-col>
      <el-col
          :xs="24"
          :sm="24"
          :lg="8"
      >
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <radar-chart />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="8"
      >
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 12}"
        :xl="{span: 12}"
        style="padding-right:8px;margin-bottom:30px;"
      >
        <transaction-table />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <todo-list />
      </el-col>
      <el-col
        :xs="{span: 24}"
        :sm="{span: 12}"
        :md="{span: 12}"
        :lg="{span: 6}"
        :xl="{span: 6}"
        style="margin-bottom:30px;"
      >
        <box-card />
      </el-col>
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
    GaugeChart,
    GithubCorner,
    BarChart,
    BoxCard,
    LineChart,
    PanelGroup,
    PieChart,
    RadarChart,
    TodoList,
    TransactionTable
  }
})
export default class extends Vue {
  private lineChartData = lineChartData.newVisitis
  private gaugeChartData = 0
  private gaugeChartData2 = 0

  created() {
    setInterval(this.updateCpuUsage, 1000)
  }

  private updateCpuUsage() {
    this.gaugeChartData = getRandomInt(5, 95)
    this.gaugeChartData2 = getRandomInt(5, 95)
  }

  private handleSetLineChartData(type: string) {
    this.lineChartData = lineChartData[type]
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
