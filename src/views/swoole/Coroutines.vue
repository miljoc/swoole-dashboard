<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <el-input
      v-model="search"
      placeholder="Called Function / Source File"
      @input="filterHandler"
      style="margin: 0 10px 10px 0;"
    ></el-input>
    <el-button type="default" style="color:#909399;" @click="clearFilter">clear filter</el-button>
    <!---------------------------查询------结束----------------------->

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
          width="150"
          sortable="id"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Elapsed"
          width="150"
          sortable="elapsed"
      >
        <template slot-scope="{row}">
          <span>{{ row.elapsed | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Stack Usage"
          width="150"
          sortable="stack_usage"
      >
        <template slot-scope="{row}">
          <span>{{ row.stack_usage | amountRule }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Called Function"
      >
        <template slot-scope="{row}">
          <span>{{ row.backTrace | parseBackTraceCaller }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Source File"
      >
        <template slot-scope="{row}">
          <el-link type="primary" v-if="row.backTrace.length > 0">
            <router-link class="link-type"
                         :to="{path: `/includedfiles_detail?file_name=${row.backTrace[0].file}`}">
              {{ row.backTrace| parseBackTraceSource }}
            </router-link>
          </el-link>
          <span v-else> - </span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleBackTrace(scope.row)">BackTrace</el-button>
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

    <el-dialog title="BackTrace" :visible.sync="dialogTableVisible">
      <el-table :data="backTrace">
        <el-table-column property="id" label="ID" width="50"></el-table-column>
        <el-table-column property="name" label="Function"></el-table-column>
        <el-table-column property="file" label="File"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCoroutineList, getCoroutineBackTrace } from '@/api/server'
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { amountRule, getSortFun, inArray } from '@/utils'

const parseBackTraceSource = (_frame_list: any) => {
  if (_frame_list.length === 0) {
    return '-'
  }
  const frame0 = _frame_list[0]
  return frame0.file + ':' + frame0.line
}

const parseBackTraceCaller = (_frame_list: any) => {
  if (_frame_list.length === 0) {
    return '-'
  }
  const frame0 = _frame_list[0]
  let bt = ''
  if (frame0.class) {
    bt = frame0.class + frame0.type + frame0.function
  } else {
    bt = frame0.function
  }
  return bt + '()'
}

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  },
  filters: {
    parseBackTraceCaller: parseBackTraceCaller,
    parseBackTraceSource: parseBackTraceSource,
    amountRule: amountRule
  }
})
export default class extends Vue {
  private allList: IWorkerCoroutineData[] = [] // 接口返回原始数据
  private handleAllList: IWorkerCoroutineData[] = [] // 处理处理后所有数据
  private list: IWorkerCoroutineData[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
  private dialogTableVisible = false
  private listQuery = {
    page: 1,
    limit: 10
  }

  private backTrace = [{}]

  // 搜索
  private search = ''

  created() {
    this.getData()
  }

  private async handleBackTrace(row: any) {
    this.backTrace = [{}]

    const cid = row.id
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getCoroutineBackTrace(worker, cid)

    let trace
    for (let index = 0; index < data.length; index++) {
      trace = data[index]
      if (!trace.class) {
        trace.class = ''
      }
      if (!trace.type) {
        trace.type = ''
      }
      this.backTrace[index] = {
        id: `#${index}`,
        file: `${trace.file || ''}${trace.line || '' ? ':' + trace.line : ''}`,
        name: `${trace.class}${trace.type}${trace.function}()`
      }
    }

    this.dialogTableVisible = true

    console.log(this.backTrace)
  }

  /**
   * 发送请求
   * @private
   */
  private async sendApi() {
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getCoroutineList(worker)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.sendApi()

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
    if (this.search.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        const tmpStr = this.search.toLowerCase()
        return (
          item.backTrace[0].class.toString().toLowerCase().indexOf(tmpStr) !== -1 ||
          item.backTrace[0].function.toString().toLowerCase().indexOf(tmpStr) !== -1 ||
          item.backTrace[0].file.toString().toLowerCase().indexOf(tmpStr) !== -1 ||
          item.backTrace[0].line.toString().toLowerCase().indexOf(tmpStr) !== -1
        )
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
    if (this.search.length > 0) {
      console.log('清除筛选项')
      this.search = ''
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
    if (this.search.length === 0) {
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
