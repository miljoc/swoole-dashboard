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
        label="ID"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Elapsed"
      >
        <template slot-scope="{row}">
          <span>{{ row.elapsed }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleBackTrace(scope.row)">BackTrace</el-button>
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

    <el-dialog title="BackTrace" :visible.sync="dialogTableVisible">
      <el-table :data="backTrace">
        <el-table-column property="id" label="ID" width="50"></el-table-column>
        <el-table-column property="name" label="Function"></el-table-column>
        <el-table-column property="file" label="File"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getCoroutineInfo } from '@/api/server'
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private list: IWorkerCoroutineData[] = []
  private listLoading = true
  private total = 0
  private dialogTableVisible = false
  private listQuery = {
    page: 1,
    limit: 10
  }

  private backTrace = [{}]

  created() {
    this.getData()
  }

  private handleBackTrace(row: any) {
    this.backTrace = [{}]

    let trace
    for (let index = 0; index < row.backTrace.length; index++) {
      trace = row.backTrace[index]
      this.backTrace[index] = {
        id: `#${index}`,
        file: `${trace.file || ''}${trace.line || '' ? ':' + trace.line : ''}`,
        name: `${trace.class}${trace.type}${trace.function}`
      }
    }

    this.dialogTableVisible = true

    console.log(this.backTrace)
  }

  private async getData() {
    this.listLoading = true
    const { id } = this.$route.params
    const { data } = await getCoroutineInfo(id)

    const total = data.length

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const list: IWorkerCoroutineData[] = []

    for (let index = start; index < end; index++) {
      list[index] = data[index]
    }

    this.list = list
    this.total = total
    this.listLoading = false
  }
}
</script>
