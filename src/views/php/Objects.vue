<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <!---------------------------class------开始----------------------->
    <el-select
      v-model="classFieldValue"
      multiple
      collapse-tags
      placeholder="Class"
      style="margin: 0 10px 10px 0;"
      filterable
      @change="filterHandler"
    >
      <el-option
        v-for="item in classOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <!---------------------------class------结束----------------------->
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
        label="Object ID"
        sortable="id"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Objectc Hash"
        sortable="hash"
      >
        <template slot-scope="{row}">
          <span>{{ row.hash }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Class"
      >
        <template slot-scope="{row}">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Memory Size"
          sortable="memory_size"
      >
        <template slot-scope="{row}">
          <span>{{ row.memory_size | bytesFormat }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleVarDump(scope.row)">
            Var Dump
          </el-button>
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
import { getObjects } from '@/api/server'
import { IObjectsData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, getSortFun, inArray } from '@/utils'

@Component({
  name: 'PHPObjects',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat
  }
})
export default class extends Vue {
  private allList: IObjectsData[] = [] // 接口返回原始数据
  private handleAllList: IObjectsData[] = [] // 处理处理后所有数据
  private list: IObjectsData[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 筛选项数据
  private classFieldValue: Array<string> = []
  private classOptions: any = []

  created() {
    this.getData()
  }

  /**
   * VarDump操作
   * @param row
   * @private
   */
  private handleVarDump(row: any) {
    this.$router.push({ path: '/object_var_dump?object_id=' + row.id + '&object_hash=' + row.hash })
  }

  /**
   * 发送请求
   * @private
   */
  private async sendApi() {
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getObjects(worker)
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
    const tmpClass: Array<any> = []
    for (let index = 0; index < data.length; index++) {
      // 处理 class 选项数据
      tmpClass[index] = data[index].class
    }

    // 去除重复值
    for (let i = 0; i < tmpClass.length; i++) {
      if (tmpClass.indexOf(tmpClass[i]) === i) {
        this.classOptions.push(tmpClass[i])
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

    if (this.classFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.class, this.classFieldValue)
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
    if (this.classFieldValue.length > 0) {
      console.log('清除筛选项')
      this.classFieldValue = []
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
    if (this.classFieldValue.length === 0) {
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
