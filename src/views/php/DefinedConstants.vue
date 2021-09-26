<template>
  <div class="app-container">
    <el-select
      v-model="ConstantsNameFieldValue"
      multiple
      filterable
      collapse-tags
      placeholder="Constants Name"
      style="margin: 0 10px 10px 0;width: 300px;"
      @change="filterHandler"
    >
      <el-option
        v-for="item in ConstantsNameOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>

    <el-button type="default" style="color:#909399;" @click="clearFilter">clear</el-button>

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
          <span>{{ row.values }}</span>
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
import { IDeclaredConstants } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getSortFun } from '@/utils/index'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private ConstantsNameFieldValue: Array<string> = []
  private ConstantsNameOptions: any = []

  private list: IDeclaredConstants[] = []
  private tmpData: any = []
  private handleAllList: Array<any> = []
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }
  private field = ''
  private order = ''
  private column = ''

  created() {
    this.getList()
  }

  /**
   * 点击搜索过滤数据
   * @private
   */
  private filterHandler() {
    this.handleAllList = JSON.parse(JSON.stringify(this.list))

    const tmpList = []

    if (this.ConstantsNameFieldValue.length > 0) {
      for (let i = 0; i < this.ConstantsNameFieldValue.length; i++) {
        tmpList.push(this.handleAllList.filter((item) => {
          let mark = true
          if (item.name !== this.ConstantsNameFieldValue[i]) {
            mark = false
          }
          return mark
        })[0])
      }
      this.handleAllList = tmpList
    }

    let index = this.ConstantsNameFieldValue.length
    if (index > this.listQuery.limit ) {
      this.listQuery.limit = (Math.ceil( index/this.listQuery.limit ))  * 10
    }

    this.listQuery.page = 1
    this.total = this.handleAllList.length
    this.tmpData = this.handleAllList
  }

  private clearFilter(): void {
    if ( this.ConstantsNameFieldValue.length > 0) {
      this.ConstantsNameFieldValue = []
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
    this.field = column.column.sortable
    this.column = column
    if (column.order !== null) {
      this.order = column.order
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      this.handleAllList = JSON.parse(JSON.stringify(this.list)) // 备份初始数据
      this.handleAllList = getSortFun(field, sortType, this.handleAllList) // 处理使用数据
      this.tmpData = this.handleAllList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit) // 当前页显示数据
    } else {
      console.log(field + '取消排序')
      // this.list = this.allList.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
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
        value: data[name], // 不转化千分位做排序
        values:data[name].toLocaleString() // 千分位展示
      })
      this.ConstantsNameOptions.push(name)
    }
    this.total = this.list.length
  }

  private async getList() {
    this.listLoading = true

    if (this.list.length === 0) {
      await this.getData()
    }

    if (this.field != '' && this.order != '') {
      this.sortChange(this.column)
    } else {
      this.tmpData = []
      for (const item of this.list) {
        if (item.id >= (this.listQuery.page - 1) * this.listQuery.limit && item.id < this.listQuery.page * this.listQuery.limit) {
          this.tmpData.push(item)
        }
      }
    }

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
