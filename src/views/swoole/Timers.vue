<template>
  <div class="app-container">
    <!---------------------------返回按钮------开始----------------------->
    <BackButton />
    <!---------------------------返回按钮------开始----------------------->
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
        label="ID"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Interval"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.interval }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Exec Msec"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.exec_msec }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Exec Count"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.exec_count }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Round"
      >
        <template slot-scope="{row}">
          <span>{{ row.info.round }}</span>
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
import { getTimerList } from '@/api/server'
import { IWorkerTimerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import BackButton from '@/components/BackButton/index.vue'

@Component({
  name: 'InlineEditTable',
  components: {
    BackButton,
    Pagination
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
      const worker = this.$route.query.worker ?? 'master'
      const { data } = await getTimerList(worker)
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
