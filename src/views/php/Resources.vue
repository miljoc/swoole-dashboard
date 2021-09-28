<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <!---------------------------type------开始----------------------->
    <el-select
      v-model="typeFieldValue"
      multiple
      collapse-tags
      placeholder="Type"
      style="margin: 0 10px 10px 0;"
      filterable
      @change="filterHandler"
    >
      <el-option
        v-for="item in typeOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <!---------------------------type------结束----------------------->
    <!---------------------------info------开始----------------------->
    <el-select
      v-model="infoFieldValue"
      multiple
      collapse-tags
      placeholder="Info"
      style="margin: 0 10px 10px 0;"
      filterable
      @change="filterHandler"
    >
      <el-option
        v-for="item in infoOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <!---------------------------info------结束----------------------->
    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>
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
          label="Type"
      >
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Info"
      >
        <template slot-scope="{row}">
          <span>{{ row | parseResourceInfo }}</span>
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
import { getResources } from '@/api/phpinfos'
import { IDefinedFunction, IResource } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { getSortFun, inArray, parseResourceInfo } from '@/utils'

@Component({
  name: 'Resources',
  components: {
    Pagination
  },
  filters: {
    parseResourceInfo: parseResourceInfo
  }
})
export default class extends Vue {
  private allList: IResource[] = [] // 接口返回原始数据
  private handleAllList: IResource[] = [] // 处理处理后所有数据
  private list: IResource[] = [] // 当前页显示数据
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 筛选项数据
  private typeFieldValue: Array<string> = []
  private typeOptions: any = []
  private infoFieldValue: Array<string> = []
  private infoOptions: any = []

  created() {
    this.getData()
  }

  /**
   * 发送请求
   * @private
   */
  private async getResources() {
    const worker: string = (this.$route.query.worker ?? 'master') as string
    const { data } = await getResources(worker)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.getResources()

    // 筛选项数据
    const tmpType: Array<any> = []
    const tmpInfo: Array<any> = []
    for (let index = 0; index < data.length; index++) {
      // 处理 type 选项数据
      tmpType[index] = data[index].type
      // 处理 info 选项数据
      tmpInfo[index] = data[index].info !== undefined ? data[index].info.stream_type : '-'
    }

    // 去除重复值
    for (let i = 0; i < tmpType.length; i++) {
      if (tmpType.indexOf(tmpType[i]) === i) {
        this.typeOptions.push(tmpType[i])
      }
    }

    for (let i = 0; i < tmpInfo.length; i++) {
      if (tmpInfo.indexOf(tmpInfo[i]) === i) {
        this.infoOptions.push(tmpInfo[i])
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

    if (this.typeFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.type, this.typeFieldValue)
      })
    }

    if (this.infoFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        if (item.info === undefined) {
          item.info = { stream_type: '-' }
        }
        return inArray(item.info.stream_type, this.infoFieldValue)
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
    if (this.typeFieldValue.length > 0 || this.infoFieldValue.length > 0) {
      console.log('清除筛选项')
      this.typeFieldValue = []
      this.infoFieldValue = []
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
    if (this.typeFieldValue.length === 0 && this.infoFieldValue.length === 0) {
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
