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
          label="Session ID"
      >
        <template slot-scope="{row}">
          <span>{{ row.session_id }}</span>
        </template>
      </el-table-column>

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
          label="Socket Name"
      >
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.address }}:{{ row.port }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Server Port"
      >
        <template slot-scope="{row}">
          <span>{{ row.server_port }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Connect Time"
      >
        <template slot-scope="{row}">
          <span>{{ row.connect_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>


      <el-table-column
          align="center"
          label="Last Received Time"
      >
        <template slot-scope="{row}">
          <span>{{ row.last_recv_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Last Sent Time"
      >
        <template slot-scope="{row}">
          <span>{{ row.last_send_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Send Buffer Size"
      >
        <template slot-scope="{row}">
          <span>{{ row.out_buffer_size | byteFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="recv_queued_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.recv_queued_bytes | byteFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="send_queued_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.send_queued_bytes | byteFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes sent"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_send_bytes | byteFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes received"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_recv_bytes | byteFormat }}</span>
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
import { getServerSetting, getConnections } from '@/api/server'
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { byteFormat, parseTime } from '@/utils/index'

@Component({
  name: 'EventList',
  components: {
    Pagination
  },
  filters: {
    byteFormat: byteFormat,
    parseTime: parseTime,
    eventsFitler: (events: number) => {
      const array = []
      if (events & 512) {
        array.push('Readable')
      }
      if (events & 1024) {
        array.push('Writable')
      }
      return array.join(' | ')
    }
  }
})

export default class extends Vue {
  private list: IWorkerCoroutineData[] = []
  private listLoading = true
  private total = 0
  private _timer
  private listQuery = {
    page: 1,
    limit: 10
  }

  private serverSetting = {
    mode: 1
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

  //
  // @Watch('list')
  // onPropertyChanged(value: string, oldValue: string) {
  //   this.timer()
  // }

  private async getData() {
    this.listLoading = true
    {
      const { data } = await getServerSetting()
      this.serverSetting = data
    }

    let list = []

    if (this.serverSetting.mode === 2) {
      for (let i = 0; i < this.serverSetting.reactor_num; i++) {
        const { data } = await getConnections('reactor-' + i)
        list = list.concat(data)
      }
    } else {

    }

    console.dir(list)

    // eslint-disable-next-line camelcase
    list.sort((a: { session_id: number }, b: { session_id: number }) => {
      return a.session_id - b.session_id
    })

    const total = list.length

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const _tmpList = []
    for (let index = start; index < end; index++) {
      _tmpList[index] = list[index]
    }

    this.list = _tmpList
    this.total = total
    this.listLoading = false
  }
}
</script>
