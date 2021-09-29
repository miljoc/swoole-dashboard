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
        :label="$t('timers.interval')"
        sortable="info.interval"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.interval | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('timers.execMsec')"
        sortable="info.exec_msec"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.exec_msec | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          :label="$t('timers.execCount')"
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
          <span>{{ row.info.round | amountRule}}</span>
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

  created() {
    this.getData()
  }

  /**
   * 发送请求
   * @private
   */
  private async getTimerList() {
    const worker: string = (this.$route.query.worker ?? 'master') as string
    const { data } = await getTimerList(worker)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.getTimerList()

    this.allList = JSON.parse(JSON.stringify(data))
    this.handleAllList = data
    this.showList(this.handleAllList)
    this.total = this.handleAllList.length
    this.listLoading = false
  }

  /**
   * 点击排序
   * @param column
   */
  private sortChange(column:any) {
    const field: string = column.column.sortable // 排序字段

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
