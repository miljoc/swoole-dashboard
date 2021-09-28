<template>
  <div class="app-container">

    <el-alert
        :closable="false"
        style="display:inline-block; vertical-align:middle; margin-bottom: 10px; margin-top: 10px "
        :title="'Reactor Threads ' + '(' + threads.length + ')'"
        type="success"
        effect="dark"
        v-if="type === 'master'"
    />

    <el-table
        :data="threads"
        highlight-current-row
        fit
        border
        v-if="type === 'master'"
        style="width: 100%; margin-bottom: 20px"
        @sort-change="reactorSortChange"
    >
      <el-table-column label="ID" align="center" sortable="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="TID" align="center" sortable="tid">
        <template slot-scope="scope">
          <span>{{ scope.row.tid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center" sortable="event_num">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/events/?worker=reactor-${scope.row.id}`}">{{ scope.row.event_num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center" sortable="timer_num">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_num | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Dispatch Count" align="center" sortable="dispatch_count">
        <template slot-scope="scope">
          <span>{{ scope.row.dispatch_count | amountRule }}</span>
        </template>
      </el-table-column>

    </el-table>

    <el-alert
        :closable="false"
        style="display:inline-block; vertical-align:middle; margin-bottom: 10px "
        title="Master Thread"
        type="warning"
        effect="dark"
        v-if="type === 'master'"
    />

    <el-table
        v-loading="listLoading"
        :data="workers"
        highlight-current-row
        fit
        border
        style="width: 100%"
        @sort-change="sortChange"
    >
      <el-table-column label="ID" align="center" v-if="type === 'worker' || type === 'task_worker'" sortable="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="PID" align="center" sortable="pid">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Coroutines" align="center"  v-if="type !== 'manager'" sortable="coroutine_stats.coroutine_num">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/coroutines/?worker=${type}-${scope.$index}`}">{{ scope.row.coroutine_stats.coroutine_num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center" v-if="type !== 'manager'" sortable="coroutine_stats.event_num">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/events/?worker=${type}-${scope.$index}`}">{{ scope.row.coroutine_stats.event_num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Reload Count" align="center" v-if="type === 'manager'" sortable="reload_count">
        <template slot-scope="scope">
          <span>{{ scope.row.reload_count | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Time of last reload" align="center" v-if="type === 'manager'" sortable="reload_last_time">
        <template slot-scope="scope">
          <span>{{ scope.row.reload_last_time | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center" sortable="timer_stats.num">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/timers/?worker=${type}-${scope.$index}`}">{{ scope.row.timer_stats.num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Objects" align="center" sortable="vm_status.object_num">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/objects/?worker=${type}-${scope.$index}`}"> {{ scope.row.vm_status.object_num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Resources" align="center" sortable="vm_status.resource_num">
        <template slot-scope="scope">

          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/resources/?worker=${type}-${scope.$index}`}">{{ scope.row.vm_status.resource_num | amountRule }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Memory Usage" align="center" sortable="memory_usage">
        <template slot-scope="scope">
          <span>{{ scope.row.memory_usage | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column label="VmSize" align="center" sortable="process_status.VmSize">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/memory_info/${type}-${scope.$index}`}"> {{ scope.row.process_status.VmSize | toBytes | bytesFormat }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="VmRSS" align="center" sortable="process_status.VmRSS">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/memory_info/${type}-${scope.$index}`}">
              {{ scope.row.process_status.VmRSS | toBytes | bytesFormat }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="V-CS" align="center" sortable="process_status.voluntary_ctxt_switches">
        <template slot-scope="scope">
          <span>{{ scope.row.process_status.voluntary_ctxt_switches | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column label="NV-CS" align="center" sortable="process_status.nonvoluntary_ctxt_switches">
        <template slot-scope="scope">
          <span>{{ scope.row.process_status.nonvoluntary_ctxt_switches | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="viewWorkerDetail(scope.row, scope.$index)">
            <svg-icon name="detail" /> View Details
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-if="type === 'worker' || type === 'task_worker'"
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="jumpPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getServerStats, getWorkerInfo, getTaskWorkerInfo, getThreadInfo, getServerSetting } from '@/api/server'
import { IServerSetting, IThreadData, IWorkerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import request from '@/utils/request'
import { bytesFormat, parseTime, getSortFun, amountRule } from '@/utils'

@Component({
  name: 'Workers',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    parseTime: parseTime,
    amountRule: amountRule,
    toBytes: (bytes: string) => {
      if (bytes.substring(bytes.length - 2, bytes.length) === 'kB') {
        return parseInt(bytes.substring(0, bytes.length - 3), 10) * 1024
      } else {
        return parseInt(bytes, 10)
      }
    }
  }
})

export default class extends Vue {
  @Prop({ default: 'master' }) private type!: string
  private allWorkers: IWorkerData[] = []
  private handleAllWorkers: IWorkerData[] = []
  private workers: IWorkerData[] = []

  private allThreads: IThreadData[] = []
  private threads: IThreadData[] = []

  private serverSetting: IServerSetting = {
    mode: 0,
    reactor_num: 0,
    manager_pid: 0,
    task_worker_num: 0,
    worker_num: 0,
    master_pid: 0
  }

  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 10,
    type: this.type
  }

  created() {
    switch (this.type) {
      case 'master':
        this.getThreads()
        break
      case 'task_worker':
        this.getTaskerWorkers()
        break
      case 'manager':
        this.getManagerInfo()
        break
      case 'worker':
      default:
        this.getWorkers()
        break
    }
  }

  private viewWorkerDetail(row: any, index: number) {
    this.$router.push({ path: `/worker/${this.type}-${index}` })
  }

  private async getWorkers() {
    this.listLoading = true
    const { data } = await getServerStats()

    // const total = data.worker_num
    //
    // const start = (this.listQuery.page - 1) * this.listQuery.limit
    // let end = this.listQuery.page * this.listQuery.limit
    //
    // end = Math.min(total, end)

    const workers: IWorkerData[] = []

    for (let index = 0; index < data.worker_num; index++) {
      const { data } = await getWorkerInfo(index)
      workers[index] = data
    }

    this.allWorkers = JSON.parse(JSON.stringify(workers))
    this.handleAllWorkers = workers
    this.showList(this.handleAllWorkers)
    this.total = this.allWorkers.length
    this.listLoading = false
  }

  private async getThreads() {
    this.listLoading = true
    const { data } = await getServerSetting()

    this.serverSetting = data
    if (this.serverSetting.mode === 1) {
      return
    }

    const total = this.serverSetting.reactor_num
    const master_pid = this.serverSetting.master_pid

    const threads = []

    for (let index = 0; index < total; index++) {
      const { data } = await getThreadInfo(index)
      threads[index] = data
    }

    // do {
    //   const { data } = await request({
    //     url: '/api/get_thread_info/master',
    //     method: 'get'
    //   })
    //   threads[total] = data
    // } while (0)

    do {
      const workers: IWorkerData[] = []
      const { data } = await request({
        url: '/api/get_worker_info/master',
        method: 'get'
      })
      data.id = 0
      data.pid = master_pid
      workers[0] = data
      this.allWorkers = JSON.parse(JSON.stringify(workers))
      this.workers = workers
    } while (0)

    this.allThreads = JSON.parse(JSON.stringify(threads))
    this.threads = threads
    this.total = total
    this.listLoading = false
  }

  private async getManagerInfo() {
    this.listLoading = true
    const { data } = await getServerSetting()

    const manager_pid = data.manager_pid
    const workers: IWorkerData[] = []

    do {
      const { data } = await request({
        url: '/api/get_worker_info/manager',
        method: 'get'
      })

      workers[0] = data
      workers[0].id = 0
      workers[0].pid = manager_pid
    } while (0)

    do {
      const { data } = await request({
        url: '/api/get_manager_info/manager',
        method: 'get'
      })
      workers[0].reload_count = data.reload_count
      workers[0].reload_last_time = data.reload_last_time
    } while (0)

    console.dir(workers[0])

    this.allWorkers = JSON.parse(JSON.stringify(workers))
    this.workers = workers
    this.total = 1
    this.listLoading = false
  }

  private async getTaskerWorkers() {
    this.listLoading = true
    const { data } = await getServerStats()

    // const total = data.task_worker_num
    //
    // const start = (this.listQuery.page - 1) * this.listQuery.limit
    // let end = this.listQuery.page * this.listQuery.limit
    //
    // end = Math.min(total, end)

    const workers: IWorkerData[] = []

    for (let index = 0; index < data.task_worker_num; index++) {
      const { data } = await getTaskWorkerInfo(index)
      workers[index] = data
    }

    this.allWorkers = JSON.parse(JSON.stringify(workers))
    this.handleAllWorkers = workers
    this.showList(this.handleAllWorkers)
    this.total = this.allWorkers.length
    this.listLoading = false
  }

  /**
   * reactor 点击排序
   * @param column
   */
  private reactorSortChange(column:any) {
    const field: string = column.column.sortable // 排序字段
    if (column.order !== null) {
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      console.log('选择' + field + '-' + sortType + '排序')
      this.threads = getSortFun(field, sortType, this.threads) // 处理使用数据
    } else {
      console.log(field + '取消排序')
      this.threads = JSON.parse(JSON.stringify(this.allThreads))
    }
  }

  /**
   * 点击排序
   * @param column
   */
  private sortChange(column:any) {
    if (this.type === 'master' || this.type === 'manager') {
      return false
    }

    const field: string = column.column.sortable // 排序字段
    if (column.order !== null) {
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      console.log('选择' + field + '-' + sortType + '排序')
      this.workers = getSortFun(field, sortType, this.handleAllWorkers) // 处理使用数据
    } else {
      console.log(field + '取消排序')
      // this.workers = JSON.parse(JSON.stringify(this.allWorkers))
    }
    this.showList(this.handleAllWorkers)
  }

  /**
   * 当前显示页数据
   * @param data
   * @private
   */
  private showList(data: Array<any>) {
    this.workers = data.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
  }

  /**
   * 数据翻页显示数据
   * @private
   */
  private jumpPage() {
    this.showList(this.handleAllWorkers)
  }
}
</script>
