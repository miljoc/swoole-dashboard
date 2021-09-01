<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="workers"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="进程名称" align="center" width="180">
        <template slot-scope="scope">
          <span>Worker-{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程 PID" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template>
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
      <el-table-column label="事件" align="center">
        <template>
        </template>
      </el-table-column>
      <el-table-column label="协程" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.co }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
          >查看详情
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getWorkers"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getPid, getMemoryUsage, getServerStatsInfo } from '@/api/server'
import { IWorkersData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Workers',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private workers: IWorkersData[] = [];
  private total = 0
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 20
  }

  created() {
    this.getWorkers()
  }

  private handleEdit(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private async getWorkers() {
    this.listLoading = true
    const { data } = await getServerStatsInfo('worker-0')

    const total = data.worker_num

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const workers: IWorkersData[] = []
    for (let index = start; index < end; index++) {
      const workerPid = await getPid('worker-' + index)
      const getWorkerMemoryUsage = await getMemoryUsage('worker-' + index)
      const getWorkerServerStats = await getServerStatsInfo('worker-' + index)

      workers[index] = { id: index, pid: workerPid.data.pid, usage: getWorkerMemoryUsage.data.usage, realUsage: getWorkerMemoryUsage.data.real_usage, co: getWorkerServerStats.data.coroutine_num }
    }

    this.workers = workers
    this.total = total
    this.listLoading = false
  }
}
</script>
