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
          <span style="color: #1890ff;cursor: pointer;font-size: 14px;font-weight: 500;" @click="showSocketInfo(row.fd)">{{ row.fd }}</span>
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

      <el-table-column label="action" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleCloseSession(scope.row, scope.$index)">
            CloseSession
          </el-button>
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

    <!-------------------fd详情信息-----开始-------------------------------------------------->
      <el-dialog title="SocketInfo" :visible.sync="dialogTableVisible">
        <el-descriptions
                border
                :column=1>
          <el-descriptions-item :label="index" v-for="(item, index) in socketInfo" v-key="index">{{ item }}</el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    <!-------------------fd详情信息-----结束-------------------------------------------------->
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getServerSetting, getConnections, closeConnection, getSocketInfo } from '@/api/server'
import { IWorkerCoroutineData, IServerSetting } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, parseTime } from '@/utils/index'

@Component({
  name: 'EventList',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
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
  private allList: IWorkerCoroutineData[] = [] // 接口返回原始数据
  private handleAllList: Array<any> = [] // 处理处理后所有数据
  private list: IWorkerCoroutineData[] = [] // 当前页显示数据
  private socketInfo = {} // socket info数据
  private dialogTableVisible = false
  private listLoading = true
  private total = 0
  // private _timer: any
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
    // clearTimeout(this._timer)
  }

  // private timer() {
  //   this._timer = setTimeout(() => {
  //     this.getData()
  //   }, 3000)
  // }

  //
  // @Watch('list')
  // onPropertyChanged(value: string, oldValue: string) {
  //   this.timer()
  // }

  /**
   * 显示socket info详情
   * @private
   */
  private async showSocketInfo(fd) {
    this.dialogTableVisible = true
    const { data } = await getSocketInfo(fd)
    this.socketInfo = data
    // this.socketInfo = Object.keys(data).map(function(i) { return data[i] })
  }

  /**
   * 获取连接数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    {
      const { data } = await getServerSetting()
      this.serverSetting = data
    }

    // eslint-disable-next-line camelcase
    let list: { session_id: 0 }[] = []

    if (this.serverSetting.mode === 2) {
      for (let i = 0; i < this.serverSetting.reactor_num; i++) {
        const { data } = await getConnections('reactor-' + i)
        list = list.concat(data)
      }
    } else {
      console.log(111)
    }

    // console.dir(list)

    // eslint-disable-next-line camelcase
    list.sort((a: { session_id: number }, b: { session_id: number }) => {
      return a.session_id - b.session_id
    })

    const total = list.length

    // const start = (this.listQuery.page - 1) * this.listQuery.limit
    // let end = this.listQuery.page * this.listQuery.limit
    // end = Math.min(total, end)

    // const _tmpList = []
    // for (let index = start; index < end; index++) {
    //   _tmpList[index] = list[index]
    // }

    // this.list = _tmpList
    this.allList = JSON.parse(JSON.stringify(list)) // 备份初始数据
    this.handleAllList = list // 处理使用数据
    this.showList(this.handleAllList)
    this.total = total
    this.listLoading = false
  }

  /**
   * 断开连接询问框
   * @param res
   * @private
   */
  private handleCloseSession(res) {
    this.$confirm('Confirm whether to close the connection？', {
      confirmButtonText: 'close',
      cancelButtonText: 'cancel',
      type: 'warning'
    })
      .then(() => {
        this.closeSession(res.session_id)
      }).catch(() => {
        // console.log(this.list)
      })
  }

  /**
   * 断开连接
   * @param session_id
   * @private
   */
  private async closeSession(session_id: string) {
    const { data } = await closeConnection(session_id)
    this.$message({
      type: 'success',
      message: 'close success!'
    })
    // 删除所选记录
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].session_id === session_id) {
        this.allList.splice(i, 1)
        this.showList(this.allList)
        this.total = this.allList.length
      }
    }
  }

  /**
   * 当前显示页数据
   * @param data
   * @private
   */
  private showList(data: Array<any>) {
    this.list = data.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
  }
}
</script>
