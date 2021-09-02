
<template>
  <div>
    <el-table
        v-loading="listLoading"
        :data="workers"
        highlight-current-row
        fit
        border
        style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="PID" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" align="center" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status.toString() | workerStatusClassFilter">
            {{ scope.row.status.toString()  | workerStatusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Coroutines" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.coroutine_stats.coroutine_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.coroutine_stats.event_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.timer_stats.num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Memory Usage" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.memory_usage }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
          >查看详情</el-button
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getServerStats, getWorkerInfo } from '@/api/server'
import { IWorkerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Workers',
  components: {
    Pagination
  },
  filters: {
    workerStatusTextFilter: (status: string) => {
      return status === '1' ? 'IDLE' : 'BUSY'
    },
    workerStatusClassFilter: (status: string) => {
      return status === '1' ? 'success' : 'danger'
    }
  }
})

export default class extends Vue {
  @Prop({ default: 'master' }) private type!: string
  private workers: IWorkerData[] = [];
  private total = 0
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 20,
    type: this.type
  }

  created() {
    this.getWorkers()
  }

  private handleEdit(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private async getWorkers() {
    this.listLoading = true
    const { data } = await getServerStats()

    const total = data.worker_num

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const workers: IWorkerData[] = []

    for (let index = start; index < end; index++) {
      const { data } = await getWorkerInfo(index)
      workers[index] = data
      console.dir(data)
    }

    this.workers = workers
    this.total = total
    this.listLoading = false
  }
}
</script>
