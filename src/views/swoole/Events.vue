<template>
  <div class="app-container">
      <!---------------------------返回按钮------开始----------------------->
      <el-button type="default" style="color:#909399;margin: 0 10px 10px 0;" icon="el-icon-back"></el-button>
      <!---------------------------返回按钮------开始----------------------->

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
            :label="item"
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
          :value="item">
        </el-option>
      </el-select>
      <!---------------------------port------结束----------------------->
<!--      <el-button type="primary" icon="el-icon-search" @click="searchData">search</el-button>-->
      <el-button type="default" style="color:#909399;" @click="clearFilter">clear filter</el-button>
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
          prop="fd"
          sortable="fd"
      >
        <template slot-scope="{row}" >
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
          prop="out_buffer_size"
          sortable
      >
        <template slot-scope="{row}">
          <span>{{ row.out_buffer_size | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes sent"
          prop="total_send_bytes"
          sortable
      >
        <template slot-scope="{row}">
          <span>{{ row.total_send_bytes | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Number of bytes received"
          prop="total_recv_bytes"
          sortable
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
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, getSortFun } from '@/utils/index'

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
    private allList: IWorkerCoroutineData[] = [] // 接口返回原始数据
    private handleAllList: IWorkerCoroutineData[] = [] // 处理处理后所有数据
    private list: IWorkerCoroutineData[] = [] // 当前页显示数据
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
      // this.timer()
      this.getData()
    }

    destroyed() {
      clearTimeout(this._timer)
    }

    // 点击搜索过滤数据
    private filterHandler(value: string, row: any, column: any) {
      // const property = column['property']
      // return row[property] === value
      // console.log(value)
      // console.log(row)
      // console.log(column)
      // console.log(this.handleAllList)
      console.log(this.eventFieldValue)
      if(this.eventFieldValue.length > 0){
        this.handleAllList = this.handleAllList.filter((item) => {
          return item.events == value
        })
      }
      console.log(this.socketTypeFieldValue)
      if(this.socketTypeFieldValue.length > 0){
        this.handleAllList = this.handleAllList.filter((item) => {
          return item.socket_type == value
        })
      }
      if(this.fdTypeFieldValue.length > 0){
        this.handleAllList = this.handleAllList.filter((item) => {
          return item.fd_type == value
        })
      }
      if(this.portFieldValue.length > 0){
        this.handleAllList = this.handleAllList.filter((item) => {
          return item.port == value
        })
      }
      console.log(this.handleAllList)
      this.list = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
      this.total = this.handleAllList.length
      console.log(this.list)
    }

    // 清除筛选
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
        this.list = this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
      }
    }

    private timer() {
      this.getData()
      this._timer = setInterval(() => {
      // this._timer = setTimeout(() => {
        this.getData()
      }, 3000)
    }

    // @Watch('list')
    // onPropertyChanged(value: string, oldValue: string) {
    //   this.timer()
    //   console.log(111)
    // }

    /**
     * 获取数据
     * @private
     */
    private async getData() {
      this.listLoading = true
      const { id } = this.$route.params
      const { data } = await getAllSockets(id)
      const total = data.length // 数据总数

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

      // console.log(this.eventOptions)
      // console.log(this.socketTypeOptions)
      // console.log(this.fdTypeOptions)
      // console.log(this.portOptions)

      // const start = (this.listQuery.page - 1) * this.listQuery.limit
      // let end = this.listQuery.page * this.listQuery.limit
      // end = Math.min(total, end)
      // const list: IWorkerCoroutineData[] = []
      // for (let index = start; index < end; index++) {
      //   list[index] = data[index]
      // }
      this.allList = JSON.parse(JSON.stringify(data)) // 备份初始数据
      this.handleAllList = data // 处理使用数据
      this.list = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit) // 当前页显示数据
      // console.log(this.AllList)
      // console.log(data)
      // console.log((this.listQuery.page - 1) * this.listQuery.limit)
      // console.log(this.listQuery.limit)
      // console.log(data.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.limit))
      this.total = total
      this.listLoading = false
    }

    /**
     * 数据翻页显示数据
     * @private
     */
    private jumpPage() {
      this.list = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }

    /**
     * 点击排序
     * @param column
     */
    // private sortChange(column:any, prop:any, order:any) {
    private sortChange(column:any) {
      const field: string = column.column.sortable // 排序字段
      if (column.order !== null) {
        const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
        console.log('选择' + field + '-' + sortType + '排序')
        // console.log(this.allList)
        this.handleAllList = JSON.parse(JSON.stringify(this.allList)) // 备份初始数据
        this.handleAllList.sort(getSortFun(sortType, field)) // 处理使用数据
        this.list = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit) // 当前页显示数据
      } else {
        console.log(field + '取消排序')
        // console.log(this.allList)
        this.list = this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
      }
    }
}
</script>
