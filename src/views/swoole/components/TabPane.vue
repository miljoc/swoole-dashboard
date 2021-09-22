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
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="TID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/events/reactor-${scope.row.id}`}">{{ scope.row.event_num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timer_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Dispatch Count" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dispatch_count }}</span>
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
      <el-table-column label="ID" align="center" v-if="type === 'worker' || type === 'task_worker'">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="PID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Coroutines" align="center"  v-if="type !== 'manager'">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/coroutines/${type}-${scope.$index}`}">{{ scope.row.coroutine_stats.coroutine_num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Events" align="center" v-if="type !== 'manager'">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/events/${type}-${scope.$index}`}">{{ scope.row.coroutine_stats.event_num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Reload Count" align="center" v-if="type === 'manager'">
        <template slot-scope="scope">
          <span>{{ scope.row.reload_count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Time of last reload" align="center" v-if="type === 'manager'">
        <template slot-scope="scope">
          <span>{{ scope.row.reload_last_time | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Timers" align="center">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/timers/${type}-${scope.$index}`}">{{ scope.row.timer_stats.num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Objects" align="center">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/objects/${type}-${scope.$index}`}"> {{ scope.row.vm_status.object_num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Resources" align="center">
        <template slot-scope="scope">

          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/resources/?worker=${type}-${scope.$index}`}">{{ scope.row.vm_status.resource_num }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Memory Usage" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memory_usage | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column label="VmSize" align="center">
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

      <el-table-column label="V-CS" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.process_status.voluntary_ctxt_switches }}</span>
        </template>
      </el-table-column>

      <el-table-column label="NV-CS" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.process_status.nonvoluntary_ctxt_switches }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="viewWorkerDetail(scope.row, scope.$index)">
              View Details
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
        @pagination="getWorkers"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getServerStats, getWorkerInfo, getTaskWorkerInfo, getThreadInfo, getServerSetting } from '@/api/server'
import { IServerSetting, IThreadData, IWorkerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import request from '@/utils/request'
import { bytesFormat, parseTime, getSortFun } from '@/utils'

@Component({
  name: 'Workers',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    parseTime: parseTime,
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
  private workers: IWorkerData[] = []
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
    limit: 20,
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

  /**
   * 点击排序
   * @param column
   * @param prop
   * @param order
   */
  private sortChange(column: any, prop: any, order: any) {
    console.log(column)
    if (column.order !== null) {
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      const field: string = column.column.sortable // 排序字段
      console.log(sortType)
      console.log(field)
      console.log(this.type)
      this.workers = getSortFun(field, sortType, this.workers) // 处理使用数据
      // this.workers.sort(getSortFun(sortType, field))
    } else {
      console.log(12312312)
    }
  }

  private viewWorkerDetail(row: any, index: number) {
    this.$router.push({ path: `/worker/${this.type}-${index}` })
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
      this.workers = workers
    } while (0)

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

    this.workers = workers
    this.total = 1
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
