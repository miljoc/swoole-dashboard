<template>
  <div class="app-container">

    <el-input v-model="input" style="margin: 0 10px 10px 0;width: 300px;" :placeholder="$t('constants.name')" @keyup.enter.native="searchFilter"></el-input>

    <el-button type="primary" @click="searchFilter" icon="el-icon-search">{{ $t('common.search') }}</el-button>

    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>

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
  private list: IDeclaredConstants[] = []
  private input: any = ''
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

  private clearFilter(): void {
    this.input = ''
    this.list = []
    this.getList()
  }

  // 搜索
  private searchFilter(): void {
    this.list = []
    this.getList()
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

    const input = this.input.toUpperCase()
    this.handleAllList = JSON.parse(JSON.stringify(this.list))

    if (input.length > 0) {
      const arr:any = []
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].name.indexOf(input) >= 0) {
          arr.push(this.list[i].name)
        }
      }
      const tmpList = []
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          tmpList.push(this.handleAllList.filter((item) => {
            let mark = true
            if (item.name !== arr[i]) {
              mark = false
            }
            return mark
          })[0])
        }

        const list_s = []
        for (let i = 0; i < tmpList.length; i++) {
          list_s.push({
            name: tmpList[i].name,
            id: i + 1,
            value: tmpList[i].value, // 不转化千分位做排序
            values: tmpList[i].value.toLocaleString() // 千分位展示
          })
        }
        this.list = list_s
        this.total = this.list.length
      } else {
        this.total = 0
        this.list = []
      }
    }

    if (this.field !== '' && this.order !== '') {
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
