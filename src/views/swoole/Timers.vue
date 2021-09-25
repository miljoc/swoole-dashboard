<template>
  <div class="app-container">
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
        label="ID"
        sortable="id"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Interval"
        sortable="info.interval"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.interval }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Exec Msec"
        sortable="info.exec_msec"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.exec_msec }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Exec Count"
          sortable="info.exec_count"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.exec_count | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Round"
        sortable="info.round"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.round }}</span>
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
import { Component, Vue } from 'vue-property-decorator'
import { getTimerList } from '@/api/server'
import { IWorkerTimerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { amountRule, getSortFun, inArray } from '@/utils'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  },
  filters: {
    amountRule: amountRule
  }
})
export default class extends Vue {
  private allList: IWorkerTimerData[] = [] // 接口返回原始数据
  private handleAllList: IWorkerTimerData[] = [] // 处理处理后所有数据
  private list: IWorkerTimerData[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
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

  /**
   * 发送请求
   * @private
   */
  private async sendApi() {
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getTimerList(worker)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.sendApi()

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
