<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="tmpData"
        border
        fit
        highlight-current-row
        width="100%"
    >
      <el-table-column
          align="center"
          label="ID"
          width="200"
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
        @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getResources } from '@/api/phpinfos'
import { IDefinedFunction } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { parseResourceInfo } from '@/utils'

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
  private list: IDefinedFunction[] = []
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

  private async getData() {
    const worker: string = this.$route.query.worker ?? 'master'
    const { data } = await getResources(worker)
    this.list = data
  }

  private async getList() {
    if (this.list.length === 0) {
      await this.getData()
    }
    this.listLoading = true
    this.total = this.list.length
    this.tmpData = []

    let i = 0
    for (const item of this.list) {
      i++
      if (i >= (this.listQuery.page - 1) * this.listQuery.limit && i < this.listQuery.page * this.listQuery.limit) {
        this.tmpData.push(item)
      }
    }

    console.log(this.tmpData)

    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
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
