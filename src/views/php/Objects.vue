<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%"
    >
      <el-table-column
        align="center"
        label="Object ID"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Objectc Hash"
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
      >
        <template slot-scope="{row}">
          <span>{{ row.memory_size | bytesFormat }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getObjects } from '@/api/server'
import { IWorkerTimerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, parseTime, getSortFun } from '@/utils'

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
  private list: IWorkerTimerData[] = []
  private data: IWorkerTimerData[] = []
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getData()
  }

  private async getData() {
    this.listLoading = true
    if (this.data.length === 0) {
      const worker = this.$route.params.worker
      const { data } = await getObjects(worker)
      this.data = data
    }

    const total = this.data.length

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const list: IWorkerTimerData[] = []

    for (let index = start; index < end; index++) {
      list[index] = this.data[index]
    }

    this.list = list
    this.total = total
    this.listLoading = false
  }
}
</script>
