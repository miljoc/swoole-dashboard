<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <el-input
      v-model="search"
      placeholder="Name / Source File"
      @input="filterHandler"
      style="margin: 0 10px 10px 0;"
    ></el-input>
    <el-button type="default" style="color:#909399;" @click="clearFilter">Clear</el-button>
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
          width="200"
          sortable="id"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Name"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Source File"
      >
        <template slot-scope="{row}">
          <el-link type="primary" v-if="row.type === 'user'">
            <router-link class="link-type"
                         :to="{path: `/includedfiles_detail?file_name=${row.filename}&line=${row.line}`}">
              {{ row.filename + ':' + row.line }}
            </router-link>
          </el-link>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Type"
          width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
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
import { getDefinedFunctions } from '@/api/phpinfos'
import { IDefinedFunction } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getSortFun, inArray } from '@/utils'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private allList: IDefinedFunction[] = [] // 接口返回原始数据
  private handleAllList: IDefinedFunction[] = [] // 处理处理后所有数据
  private list: IDefinedFunction[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 搜索
  private search = ''

  created() {
    this.getData()
  }

  /**
   * 发送请求
   * @private
   */
  private async sendApi() {
    const { data } = await getDefinedFunctions()
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.sendApi()

    let index = 0
    const tmpList = []

    for (const item of data.user) {
      const id = index++
      tmpList.push({
        line: item.line,
        filename: item.filename,
        name: item.function,
        id: id,
        type: 'user'
      })
    }

    for (const name of data.internal) {
      const id = index++
      tmpList.push({
        line: '',
        filename: '',
        name: name,
        id: id,
        type: 'internal'
      })
    }

    this.allList = JSON.parse(JSON.stringify(tmpList))
    this.handleAllList = tmpList
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
        if (item.name.toLowerCase().indexOf(tmpStr) !== -1 || item.filename.toLowerCase().indexOf(tmpStr) !== -1 || item.line.toString().toLowerCase().indexOf(tmpStr) !== -1) {
          return true
        } else {
          return false
        }
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

.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
