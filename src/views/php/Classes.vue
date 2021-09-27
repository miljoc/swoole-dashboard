<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <!---------------------------Name------开始----------------------->
    <el-select
      v-model="nameFieldValue"
      multiple
      collapse-tags
      placeholder="Name"
      style="margin: 0 10px 10px 0;"
      filterable
      @change="filterHandler"
    >
      <el-option
        v-for="item in nameOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <!---------------------------Name------结束----------------------->
    <el-button type="default" style="color:#909399;" @click="clearFilter">clear</el-button>
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
          <el-link type="primary">
          <router-link class="link-type"
                       :to="{path: `/class_info?class_name=${row.name}`}">{{ row.name }}
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
        @pagination="jumpPage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDeclaredClasses } from '@/api/phpinfos'
import { IDeclaredClass } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getSortFun, inArray } from '@/utils'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private allList: IDeclaredClass[] = [] // 接口返回原始数据
  private handleAllList: IDeclaredClass[] = [] // 处理处理后所有数据
  private list: IDeclaredClass[] = [] // 当前页显示数据  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 筛选项数据
  private nameFieldValue: Array<string> = []
  private nameOptions: any = []

  created() {
    this.getData()
  }

  private cancelEdit(row: any) {
    row.title = row.originalTitle
    row.edit = false
    this.$message({
      message: 'The title has been restored to the original value',
      type: 'warning'
    })
  }

  private confirmEdit(row: any) {
    row.edit = false
    row.originalTitle = row.title
    this.$message({
      message: 'The title has been edited',
      type: 'success'
    })
  }

  /**
   * 发送请求
   * @private
   */
  private async sendApi() {
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getDeclaredClasses(worker)
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
    for (const name of data) {
      const id = index++
      tmpList.push({
        name: name,
        id: id
      })
    }

    // 筛选项数据
    const tmpName: Array<any> = []
    for (let index = 0; index < tmpList.length; index++) {
      // 处理 name 选项数据
      tmpName[index] = tmpList[index].name
    }

    // 去除重复值
    for (let i = 0; i < tmpName.length; i++) {
      if (tmpName.indexOf(tmpName[i]) === i) {
        this.nameOptions.push(tmpName[i])
      }
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

    if (this.nameFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.name, this.nameFieldValue)
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
    if (this.nameFieldValue.length > 0) {
      console.log('清除筛选项')
      this.nameFieldValue = []
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
    if (this.nameFieldValue.length === 0) {
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
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
