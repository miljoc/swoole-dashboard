<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <!---------------------------Session Id------开始----------------------->
    <el-input
      v-model="searchSessionID"
      placeholder="Session ID"
      @keyup.enter.native="filterHandler"
      style="margin: 0 10px 10px 0;"
    ></el-input>
    <!---------------------------Session Id------结束----------------------->
    <!---------------------------Socket Name------开始----------------------->
    <el-input
      v-model="searchSocketName"
      :placeholder="$t('connections.socketName')"
      @keyup.enter.native="filterHandler"
      style="margin: 0 10px 10px 0;"
    ></el-input>
    <!---------------------------Socket Name------结束----------------------->
    <!---------------------------port------开始----------------------->
    <el-select
      v-model="ServerPortFieldValue"
      multiple
      filterable
      collapse-tags
      :placeholder="$t('connections.serverPort')"
      style="margin: 0 10px 10px 0;"
      @change="filterHandler"
    >
      <el-option
        v-for="item in ServerPortOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <!---------------------------port------结束----------------------->
    <el-button type="primary" @click="filterHandler" icon="el-icon-search">{{ $t('common.search') }}</el-button>
    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>
    <!---------------------------查询------结束----------------------->

    <div class="filter-container">
    <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        width="100%"
        @sort-change="sortChange"
    >
      <el-table-column
          align="center"
          label="Session ID"
          width="120"
          sortable="session_id"
      >
        <template slot-scope="{row}">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/connection_info?session_id=${row.session_id}&worker=${serverSetting.mode === 2 ? 'worker-' + row.reactor_id : 'master'}`}">
              {{ row.session_id }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="FD"
          width="120"
          sortable="fd"
      >
        <template slot-scope="{row}">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/socket_info?fd=${row.fd}&worker=${serverSetting.mode === 2 ? 'reactor-' + row.reactor_id : 'worker-' + row.reactor_id}`}">
              {{ row.fd }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.socketName')"
      >
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.address }}:{{ row.port }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.serverPort')"
      >
        <template slot-scope="{row}">
          <span>{{ row.server_port }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.connectTime')"
          sortable="connect_time"
      >
        <template slot-scope="{row}">
          <span>{{ row.connect_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('connections.lastSendTime')"
        sortable="last_send_time"
      >
        <template slot-scope="{row}">
          <span>{{ row.last_send_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.lastReceivedTime')"
          sortable="last_recv_time"
      >
        <template slot-scope="{row}">
          <span>{{ row.last_recv_time | parseTime('{h}:{i}:{s}.{M}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('connections.sendQueuedBytes')"
        sortable="send_queued_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.send_queued_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.recvQueuedBytes')"
          sortable="recv_queued_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.recv_queued_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('connections.numberOfBytesSend')"
          sortable="total_send_bytes"
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
          :label="$t('connections.numberOfBytesReceived')"
          sortable="total_recv_bytes"
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

      <el-table-column
        :label="$t('common.actions')"
        align="center"
        width="200px"
      >
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <el-button type="warning" size="mini" @click="handleCloseSession(scope.row, 0)">
              <svg-icon name='close' /> {{ $t('connections.closeSession') }}
            </el-button>
            <el-button type="danger" size="mini" @click="handleCloseSession(scope.row, 1)">
              <svg-icon name='reset' /> {{ $t('connections.resetSession') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="jumpPage"
    />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getServerSetting, getConnections, closeConnection } from '@/api/server'
import { IServerSetting, IConnectionInfo } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, eventsFitler, getSortFun, inArray, parseTime } from '@/utils/index'

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
  private allList: IConnectionInfo[] = [] // 接口返回原始数据
  private handleAllList: IConnectionInfo[] = [] // 处理处理后所有数据
  private list: IConnectionInfo[] = [] // 当前页显示数据

  private listLoading = true
  private total = 0
  // private _timer: any
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 选项参数
  private searchSessionID = ''
  private searchSocketName = ''
  private ServerPortFieldValue: Array<string> = []
  private ServerPortOptions: any = []

  private serverSetting: IServerSetting = {
    mode: 0,
    reactor_num: 0,
    manager_pid: 0,
    task_worker_num: 0,
    worker_num: 0,
    master_pid: 0
  }

  created() {
    this.getData()
  }

  destroyed() {
    // clearTimeout(this._timer)
  }

  /**
   * 断开连接询问框
   * @param res
   * @param is_reset
   * @private
   */
  private handleCloseSession(res: IConnectionInfo, is_reset = 0) {
    let str = ''
    let confirmButtonText = ''
    if (is_reset === 0) {
      str = this.$t('connections.closeWarning').toString()
      confirmButtonText = this.$t('connections.close').toString()
    } else {
      str = this.$t('connections.resetWarning').toString()
      confirmButtonText = this.$t('connections.reset').toString()
    }
    const cancelButtonText = this.$t('common.cancel').toString()
    this.$confirm(str, {
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      type: 'warning'
    })
      .then(() => {
        this.closeSession(res.session_id, is_reset)
      }).catch(() => {
        // console.log(this.list)
      })
  }

  /**
   * 断开连接
   * @param session_id
   * @param is_reset
   * @private
   */
  private async closeSession(session_id: number, is_reset: number) {
    const worker = this.$route.query.worker ?? 'master'
    await closeConnection(session_id, is_reset, worker)
    const str = this.$t('connections.closeSuccess').toString()
    this.$message({
      type: 'success',
      message: str
    })
    // 删除记录
    for (let i = 0; i < this.allList.length; i++) {
      if (this.allList[i].session_id === session_id) {
        this.allList.splice(i, 1)
      }
    }
    for (let i = 0; i < this.handleAllList.length; i++) {
      if (this.handleAllList[i].session_id === session_id) {
        this.handleAllList.splice(i, 1)
        this.showList(this.handleAllList)
        this.total = this.handleAllList.length
      }
    }
  }

  /**
   * 发送请求
   * @private
   */
  private async getServerSetting() {
    const { data } = await getServerSetting()
    return data
  }

  /**
   * 获取连接数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    this.serverSetting = await this.getServerSetting()

    // eslint-disable-next-line camelcase
    let list: IConnectionInfo[] = []
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

    list.sort((a: { session_id: number }, b: { session_id: number }) => {
      return a.session_id - b.session_id
    })

    // 筛选项数据
    const tmpPort: Array<any> = []
    for (let index = 0; index < list.length; index++) {
      // 处理 port 选项数据
      tmpPort[index] = list[index].server_port
    }

    // 去除重复值
    for (let i = 0; i < tmpPort.length; i++) {
      if (tmpPort.indexOf(tmpPort[i]) === i) {
        this.ServerPortOptions.push(tmpPort[i])
      }
    }

    this.allList = JSON.parse(JSON.stringify(list)) // 备份初始数据
    this.handleAllList = list // 处理使用数据
    this.showList(this.handleAllList)
    this.total = this.handleAllList.length
    this.listLoading = false
  }

  /**
   * 点击搜索过滤数据
   * @private
   */
  private filterHandler() {
    this.handleAllList = JSON.parse(JSON.stringify(this.allList))

    if (this.searchSessionID.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        const tmpStr = this.searchSessionID.toString()
        if (item.session_id.toString().indexOf(tmpStr) !== -1) {
          return true
        } else {
          return false
        }
      })
    }

    if (this.searchSocketName.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        const tmpStr = this.searchSocketName
        const str = item.address + ':' + item.port
        if (str === tmpStr || str.indexOf(tmpStr) !== -1) {
          return true
        } else {
          return false
        }
      })
    }

    if (this.ServerPortFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.server_port, this.ServerPortFieldValue)
      })
    }

    this.listQuery.page = 1
    this.total = this.handleAllList.length
    this.showList(this.handleAllList)
  }

  /**
   * 清除筛选
   * @private
   */
  private clearFilter(): void {
    if (this.searchSessionID.length > 0 || this.searchSocketName.length > 0 || this.ServerPortFieldValue.length > 0) {
      console.log('清除筛选项')
      this.searchSessionID = ''
      this.searchSocketName = ''
      this.ServerPortFieldValue = []
      this.handleAllList = JSON.parse(JSON.stringify(this.allList))
      this.showList(this.handleAllList)
      this.total = this.handleAllList.length
    }
  }

  /**
   * 点击排序
   * @param column
   */
  private sortChange(column:any) {
    const field: string = column.column.sortable // 排序字段
    if (
      this.searchSessionID.length === 0 &&
      this.searchSocketName.length === 0 &&
      this.ServerPortFieldValue.length === 0
    ) {
      this.handleAllList = JSON.parse(JSON.stringify(this.allList)) // 备份初始数据
    }

    if (column.order !== null) {
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      console.log('选择' + field + '-' + sortType + '排序')
      this.handleAllList = getSortFun(field, sortType, this.handleAllList) // 处理使用数据
    } else {
      console.log(field + '取消排序')
    }
    this.showList(this.handleAllList)
  }

  /**
   * 当前显示页数据
   * @param data
   * @private
   */
  private showList(data: Array<any>) {
    this.list = data.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
  }

  /**
   * 数据翻页显示数据
   * @private
   */
  private jumpPage() {
    this.showList(this.handleAllList)
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .el-input {
    width: 20%;
  }
}
</style>
