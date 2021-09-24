<template>
  <div class="app-container">
    <el-select
      v-model="SocketNameFieldValue"
      multiple
      filterable
      collapse-tags
      placeholder="Constants Name"
      style="margin: 0 10px 10px 0;"
      @change="filterHandler"
    >
      <el-option
        v-for="item in SocketNameOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>

    <el-button type="default" style="color:#909399;" @click="clearFilter">clear filter</el-button>

    <el-table
      v-loading="listLoading"
      :data="tmpData"
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
          <span>{{ row.id + 1}}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Name"
        sortable="name"
      >
        <template slot-scope="{row}">
          <el-link type="primary">
            {{ row.name }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Value"
        width="200"
        sortable="value"
      >
        <template slot-scope="{row}">
          <span>{{ row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDefinedConstants } from '@/api/phpinfos'
import {IDeclaredConstants, IDefinedFunction} from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, getSortFun } from '@/utils/index'
import {start} from "repl";

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})
export default class extends Vue {

  private SocketNameFieldValue: Array<string> = []
  private SocketNameOptions: any = []

  private list: IDeclaredConstants[] = []
  private tmpData: IDefinedFunction[] = []
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getList()
  }

  /**
   * 点击搜索过滤数据
   * @private
   */
  private filterHandler() {
    this.handleAllList = JSON.parse(JSON.stringify(this.list))

    console.log(this.handleAllList,'handleAllList')
    const tmpList = []

    if (this.SocketNameFieldValue.length > 0) {
      for (let i = 0; i < this.SocketNameFieldValue.length; i++) {
        tmpList.push(this.handleAllList.filter((item) => {
          let mark = true
          if (item.name !== this.SocketNameFieldValue[i]) {
            mark = false
          }
          return mark
        })[0])
      }
      this.handleAllList = tmpList
    }
    console.log(this.handleAllList,'handleAllList---------last')

    this.listQuery.page = 1
    this.total = this.handleAllList.length
    this.tmpData = this.handleAllList
  }

  private clearFilter(): void {
    if ( this.SocketNameFieldValue.length > 0) {
      console.log('清除筛选项')
      this.SocketNameFieldValue = []
      this.handleAllList = JSON.parse(JSON.stringify(this.list))
      this.total = this.handleAllList.length
      this.tmpData = this.list.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }
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
      // console.log('选择' + field + '-' + sortType + '排序')
      this.handleAllList = JSON.parse(JSON.stringify(this.list)) // 备份初始数据
      // console.log(sortType,'sortType')
      // console.log(field,'field')
      this.handleAllList = getSortFun(field, sortType, this.handleAllList) // 处理使用数据
      // console.log(this.handleAllList,'handleAllList')
      this.tmpData = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit) // 当前页显示数据

    } else {
      console.log(field + '取消排序')
      // console.log(this.allList)
      this.list = this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
    }
  }

  private async getData() {
    const { data } = await getDefinedConstants()
    let index = 0
    for (const name in data) {
      const id = index++
      this.list.push({
        name: name,
        id: id,
        value: data[name]
      })
    }
    this.total = this.list.length
  }

  private async getList() {
    this.listLoading = true

    if (this.list.length === 0) {
      await this.getData()
    }

    this.tmpData = []

    for (const item of this.list) {
      if (item.id >= (this.listQuery.page - 1) * this.listQuery.limit && item.id < this.listQuery.page * this.listQuery.limit) {
        this.tmpData.push(item)
      }
    }
    // start
    const tmpSocketName: Array<any> = []
    for (let index = 0; index < this.list.length; index++) {
      // 处理 events 选项数据
      tmpSocketName[index] = this.list[index].name
    }

    // 去除重复值
    for (let i = 0; i < tmpSocketName.length; i++) {
      this.SocketNameOptions.push(tmpSocketName[i])
    }
    // end

    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.3 * 1000)
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
