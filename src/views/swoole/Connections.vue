<template>
  <div class="app-container">
    <div class="filter-container">
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
            label="recv_queued_bytes"
        >
          <template slot-scope="{row}">
            <span>{{ row.recv_queued_bytes | bytesFormat }}</span>
          </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="send_queued_bytes"
        >
          <template slot-scope="{row}">
            <span>{{ row.send_queued_bytes | bytesFormat }}</span>
          </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="Number of bytes sent"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/network_traffic/?session_id=${row.session_id}&reactor_id=${row.reactor_id}`}">
                {{ row.total_send_bytes | bytesFormat }}
              </router-link>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="Number of bytes received"
        >
          <template slot-scope="{row}">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/network_traffic/?session_id=${row.session_id}&reactor_id=${row.reactor_id}`}">
                {{ row.total_recv_bytes | bytesFormat }}
              </router-link>
            </el-link>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getServerSetting, getConnections } from '@/api/server'
import { IWorkerCoroutineData, IServerSetting } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, eventsFitler, parseTime } from '@/utils/index'

@Component({
  name: 'EventList',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    parseTime: parseTime,
    eventsFitler: eventsFitler
  }
})

export default class extends Vue {
  private list: IWorkerCoroutineData[] = []
  private data: IWorkerCoroutineData[] = []
  private listLoading = true
  private total = 0
  private _timer: any
  private listQuery = {
    page: 1,
    limit: 10
  }

  private serverSetting: IServerSetting = {
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

  @Watch('list')
  onPropertyChanged(value: string, oldValue: string) {
    this.timer()
  }

  private async getData() {
    if (this.data.length === 0) {
      do {
        const { data } = await getServerSetting()
        this.serverSetting = data
      } while (0)
      // eslint-disable-next-line camelcase
      let list: { session_id: 0 }[] = []

      if (this.serverSetting.mode === 2) {
        for (let i = 0; i < this.serverSetting.reactor_num; i++) {
          const { data } = await getConnections('reactor-' + i)
          list = list.concat(data)
        }
      } else {
        for (let i = 0; i < this.serverSetting.worker_num; i++) {
          const { data } = await getConnections('worker-' + i)
          list = list.concat(data)
        }
      }

      // eslint-disable-next-line camelcase
      list.sort((a: { session_id: number }, b: { session_id: number }) => {
        return a.session_id - b.session_id
      })
      this.data = list
    }

    this.total = this.data.length
    this.listLoading = true

    const total = this.data.length
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const _tmpList = []
    for (let index = start; index < end; index++) {
      _tmpList[index] = this.data[index]
    }

    this.list = _tmpList
    this.listLoading = false
  }
}
</script>
