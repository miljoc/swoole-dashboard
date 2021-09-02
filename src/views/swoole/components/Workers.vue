
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
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Worker ID" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="PID" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Coroutines" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.coroutine_stats.coroutine_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.coroutine_stats.event_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.timer_stats.num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Memory Usage" align="center">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.memory_usage }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row, scope.$index)"
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
import { getServerStats, getWorkerInfo, getTaskWorkerInfo } from '@/api/server'
import { IWorkerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Workers',
  components: {
    Pagination
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
    switch (this.type) {
      case 'task_worker':
        this.getTaskerWorkers()
        break
      case 'worker':
      default:
        this.getWorkers()
        break
    }
  }

  private handleEdit(row: any, index: number) {
    switch (this.type) {
      case 'task_worker':
      case 'worker':
        this.$router.push({ path: `/worker/${this.type}-${index}` })
        break
    }
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

  private async getTaskerWorkers() {
    this.listLoading = true
    const { data } = await getServerStats()

    const total = data.task_worker_num

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const workers: IWorkerData[] = []

    for (let index = start; index < end; index++) {
      const { data } = await getTaskWorkerInfo(index)
      workers[index] = data
    }

    this.workers = workers
    this.total = total
    this.listLoading = false
  }
}
</script>
