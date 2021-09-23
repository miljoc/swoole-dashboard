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
          width="150"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Elapsed"
          width="150"
      >
        <template slot-scope="{row}">
          <span>{{ row.elapsed }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Stack Usage"
          width="150"
      >
        <template slot-scope="{row}">
          <span>{{ row.stack_usage }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Called Function"
      >
        <template slot-scope="{row}">
          <span>{{ row.backTrace | parseBackTraceCaller }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Source File"
      >
        <template slot-scope="{row}">
          <span>{{ row.backTrace| parseBackTraceSource }}</span>
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
import { getCoroutineList, getCoroutineBackTrace } from '@/api/server'
import { IWorkerCoroutineData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

const parseBackTraceSource = (_frame_list: any) => {
  if (_frame_list.length === 0) {
    return '-'
  }
  const frame0 = _frame_list[0]
  return frame0.file + ':' + frame0.line
}

const parseBackTraceCaller = (_frame_list: any) => {
  if (_frame_list.length === 0) {
    return '-'
  }
  const frame0 = _frame_list[0]
  let bt = ''
  if (frame0.class) {
    bt = frame0.class + frame0.type + frame0.function
  } else {
    bt = frame0.function
  }
  return bt + '()'
}

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  },
  filters: {
    parseBackTraceCaller: parseBackTraceCaller,
    parseBackTraceSource: parseBackTraceSource
  }
})
export default class extends Vue {
  private list: IWorkerCoroutineData[] = []
  private data: IWorkerCoroutineData[] = []
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

  private async handleBackTrace(row: any) {
    this.backTrace = [{}]

    const cid = row.id
    const worker = this.$route.query.worker ?? 'master'
    const { data } = await getCoroutineBackTrace(worker, cid)

    let trace
    for (let index = 0; index < data.length; index++) {
      trace = data[index]
      if (!trace.class) {
        trace.class = ''
      }
      if (!trace.type) {
        trace.type = ''
      }
      this.backTrace[index] = {
        id: `#${index}`,
        file: `${trace.file || ''}${trace.line || '' ? ':' + trace.line : ''}`,
        name: `${trace.class}${trace.type}${trace.function}()`
      }
    }

    this.dialogTableVisible = true

    console.log(this.backTrace)
  }

  private async getData() {
    this.listLoading = true
    if (this.data.length === 0) {
      const worker = this.$route.query.worker ?? 'master'
      const { data } = await getCoroutineList(worker)
      this.data = data
    }

    const total = this.data.length

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const list: IWorkerCoroutineData[] = []

    for (let index = start; index < end; index++) {
      list[index] = this.data[index]
    }

    this.list = list
    this.total = total
    this.listLoading = false
  }
}
</script>
