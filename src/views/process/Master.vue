
<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="masterWorker"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <template slot="empty">
        <span class="el-table__empty-text">{{ msg }}</span>
      </template>
      <el-table-column label="进程名称" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程PID" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程内存占用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内存实际占用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realUsage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CPU" align="center">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="定时器" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleTimer(scope.row)"
          >查看详情</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="事件" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEvent(scope.row)"
          >查看详情</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="协程" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCo(scope.row)"
          >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getServer, getMemoryUsage } from '@/api/server'
import { IMasterData } from '@/api/types'

@Component({
  name: 'Master'
})

export default class extends Vue {
  private listLoading = true
  private isBase = false
  private swooleServer = []
  private msg = '暂无数据'

  private masterWorker: IMasterData[] = []

  private master = {
    name: 'master-线程',
    pid: 0,
    usage: 0,
    realUsage: 0,
    id: 'master'
  }

  created() {
    this.getServer()
  }

  private handleTimer(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private handleEvent(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private handleCo(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private async getServer() {
    const { data } = await getServer()

    this.isBase = data.mode === 1
    this.swooleServer = data
    const masterWorker: IMasterData[] = []

    if (!this.isBase) {
      const getMasterMemoryUsage = await getMemoryUsage('master')

      this.master.pid = data.master_pid
      this.master.usage = getMasterMemoryUsage.data.usage
      this.master.realUsage = getMasterMemoryUsage.data.real_usage
      masterWorker[0] = this.master
    } else {
      this.msg = 'BASE 模式没有 Master 进程'
    }
    this.masterWorker = masterWorker
    this.listLoading = false
  }
}
</script>
