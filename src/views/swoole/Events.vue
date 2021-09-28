<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <!---------------------------Event------开始----------------------->
    <el-select
        v-model="eventFieldValue"
        multiple
        collapse-tags
        placeholder="Events"
        style="margin: 0 10px 10px 0;"
        @change="filterHandler"
    >
      <el-option
          v-for="item in eventOptions"
          :label="item | eventsFitler"
          :key="item"
          :value="item">
      </el-option>
    </el-select>
    <!---------------------------Event------结束----------------------->
    <!---------------------------Socket Type------开始----------------------->
    <el-select
        v-model="socketTypeFieldValue"
        multiple
        collapse-tags
        placeholder="Socket Type"
        style="margin: 0 10px 10px 0;"
        @change="filterHandler"
    >
      <el-option
          v-for="item in socketTypeOptions"
          :label="item | socketTypeFilter"
          :key="item"
          :value="item">
      </el-option>
    </el-select>
    <!---------------------------Socket Type------结束----------------------->
    <!---------------------------FD Type------开始----------------------->
    <el-select
        v-model="fdTypeFieldValue"
        multiple
        collapse-tags
        placeholder="FD Type"
        style="margin: 0 10px 10px 0;"
        @change="filterHandler"
    >
      <el-option
          v-for="item in fdTypeOptions"
          :label="item | fdTypeFilter"
          :key="item"
          :value="item">
      </el-option>
    </el-select>
    <!---------------------------FD Type------结束----------------------->
    <!---------------------------port------开始----------------------->
    <el-select
        v-model="portFieldValue"
        multiple
        collapse-tags
        placeholder="Ports"
        style="margin: 0 10px 10px 0;"
        @change="filterHandler"
    >
      <el-option
          v-for="item in portOptions"
          :label="item"
          :key="item"
          :value="item">
      </el-option>
    </el-select>
    <!---------------------------port------结束----------------------->
    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>
    <!---------------------------查询------结束----------------------->

    <!---------------------------表格数据------开始----------------------->
    <el-table
        ref="filterTable"
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
          label="FD"
          sortable="fd"
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
          <el-tag v-if="row.events & 512"> Readable</el-tag>
          <el-tag v-if="row.events & 1024" type="success" style="margin-left: 5px"> Writable</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Socket Type"
      >
        <template slot-scope="{row}">
          <span>{{ row.socket_type | socketTypeFilter }}</span>
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
          sortable="out_buffer_size"
      >
        <template slot-scope="{row}">
          <span>{{ row.out_buffer_size | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes sent"
          sortable="total_send_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_send_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes received"
          sortable="total_recv_bytes"
      >
        <template slot-scope="{row}">
          <span>{{ row.total_recv_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

    </el-table>
    <!---------------------------表格数据------结束----------------------->

    <!---------------------------分页------开始----------------------->
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="jumpPage"
    />
    <!---------------------------分页------结束----------------------->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getAllSockets } from '@/api/server'
import { IEventsData, IObjectsData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, getSortFun, eventsFitler, fdTypeFilter, socketTypeFilter, amountRule, inArray } from '@/utils/index'

@Component({
  name: 'EventList',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    eventsFitler: eventsFitler,
    fdTypeFilter: fdTypeFilter,
    socketTypeFilter: socketTypeFilter,
    amountRule: amountRule
  }
})

export default class extends Vue {
  private allList: IEventsData[] = [] // 接口返回原始数据
  private handleAllList: IEventsData[] = [] // 处理处理后所有数据
  private list: IEventsData[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
  private _timer: any
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 选项参数
  private eventFieldValue: Array<string> = []
  private eventOptions: any = []
  private socketTypeFieldValue: Array<string> = []
  private socketTypeOptions: any = []
  private fdTypeFieldValue: Array<string> = []
  private fdTypeOptions: any = []
  private portFieldValue: Array<string> = []
  private portOptions: any = []

  created() {
    this.getData()
  }

  destroyed() {
    // clearTimeout(this._timer)
  }

  // private timer() {
  //   this.getData()
  //   this._timer = setTimeout(() => {
  //     this.getData()
  //   }, 3000)
  // }

  // @Watch('list')
  // onPropertyChanged(value: string, oldValue: string) {
  //   this.timer()
  //   console.log(111)
  // }

  /**
   * 发送请求
   * @private
   */
  private async getAllSockets() {
    const worker = (this.$route.query.worker ?? 'master') as string
    const { data } = await getAllSockets(worker)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.getAllSockets()

    // 筛选项数据
    const tmpEvents: Array<number> = []
    const tmpSocketType: Array<number> = []
    const tmpFdType: Array<number> = []
    const tmpPort: Array<number> = []
    for (let index = 0; index < data.length; index++) {
      // 处理 events 选项数据
      tmpEvents[index] = data[index].events
      // 处理 socket type 选项数据
      tmpSocketType[index] = data[index].socket_type
      // 处理 fd type 选项数据
      tmpFdType[index] = data[index].fd_type
      // 处理 ports 选项数据
      tmpPort[index] = data[index].port
    }

    // 去除重复值
    for (let i = 0; i < tmpEvents.length; i++) {
      if (tmpEvents.indexOf(tmpEvents[i]) === i) {
        this.eventOptions.push(tmpEvents[i])
      }
    }
    for (let i = 0; i < tmpSocketType.length; i++) {
      if (tmpSocketType.indexOf(tmpSocketType[i]) === i) {
        this.socketTypeOptions.push(tmpSocketType[i])
      }
    }
    for (let i = 0; i < tmpFdType.length; i++) {
      if (tmpFdType.indexOf(tmpFdType[i]) === i) {
        this.fdTypeOptions.push(tmpFdType[i])
      }
    }
    for (let i = 0; i < tmpPort.length; i++) {
      if (tmpPort.indexOf(tmpPort[i]) === i) {
        this.portOptions.push(tmpPort[i])
      }
    }

    this.allList = JSON.parse(JSON.stringify(data))
    this.handleAllList = data
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

    if (this.eventFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.events, this.eventFieldValue)
      })
    }

    if (this.socketTypeFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.socket_type, this.socketTypeFieldValue)
      })
    }

    if (this.fdTypeFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.fd_type, this.fdTypeFieldValue)
      })
    }

    if (this.portFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.port, this.portFieldValue)
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
    if (
      this.eventFieldValue.length > 0 ||
      this.socketTypeFieldValue.length > 0 ||
      this.fdTypeFieldValue.length > 0 ||
      this.portFieldValue.length > 0
    ) {
      console.log('清除筛选项')
      this.eventFieldValue = []
      this.socketTypeFieldValue = []
      this.fdTypeFieldValue = []
      this.portFieldValue = []
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
      this.eventFieldValue.length === 0 &&
      this.socketTypeFieldValue.length === 0 &&
      this.fdTypeFieldValue.length === 0 &&
      this.portFieldValue.length === 0
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
