<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        width="100%"
    >
      <el-table-column
          align="center"
          label="FD"
      >
        <template slot-scope="{row}">
          <span>{{ row.fd }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Events"
      >
        <template slot-scope="{row}">
          <span>{{ row.events | eventsFitler }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Socket Type"
      >
        <template slot-scope="{row}">
          <span>{{ row.socket_type }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="FD Type"
      >
        <template slot-scope="{row}">
          <span>{{ row.fd_type | fdTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Name"
      >
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.address }}:{{ row.port }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Send Buffer Size"
      >
        <template slot-scope="{row}">
          <span>{{ row.out_buffer_size }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes sent"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_send_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes received"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_recv_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getAllSockets } from '@/api/server'
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat } from '@/utils/index'

@Component({
  name: 'EventList',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    eventsFitler: (events: number) => {
      const array = []
      if (events & 512) {
        array.push('Readable')
      }
      if (events & 1024) {
        array.push('Writable')
      }
      return array.join(' | ')
    },
    fdTypeFilter: (type: number) => {
      switch (type) {
        case 9:
          return 'signal'
        case 3:
          return 'pipe'
        case 0:
          return 'session'
        default:
          return 'php_stream'
      }
    }
  }
})

export default class extends Vue {
  private list: IWorkerCoroutineData[] = []
  private listLoading = true
  private total = 0
  private _timer
  private dialogTableVisible = false
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getData()
  }

  destroyed() {
    clearTimeout(this._timer)
  }

  private timer() {
    this._timer = setTimeout(() => {
      this.getData()
    }, 3000)
  }

  @Watch('list')
  onPropertyChanged(value: string, oldValue: string) {
    this.timer()
  }

  private async getData() {
    this.listLoading = true
    const { id } = this.$route.params
    const { data } = await getAllSockets(id)

    const total = data.length

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const list: IWorkerCoroutineData[] = []

    for (let index = start; index < end; index++) {
      list[index] = data[index]
    }

    this.list = list
    this.total = total
    this.listLoading = false
  }
}
</script>
