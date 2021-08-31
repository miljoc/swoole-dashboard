
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
  private listLoading = true;
  private isBase = false
  private swooleServer = []

  private masterWorker: IMasterData[] = [];

  private master = {
    name: 'master-线程',
    pid: 0,
    usage: 0,
    realUsage: 0
  }

  created() {
    this.getServer()
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
    }
    this.masterWorker = masterWorker
    this.listLoading = false
  }
}
</script>
