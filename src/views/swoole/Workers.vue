
<template>
  <div class="customzie">
    <el-table
      v-loading="listLoading"
      :data="workers"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="进程序号" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getWorkers"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getServerStats } from '@/api/server'
import { IWorkerData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Workers',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private workers: IWorkerData[] = [];
  private total = 0
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 20
  }

  created() {
    this.getWorkers()
  }

  private handleEdit(row: any) {
    this.$router.push({ path: `/worker/${row.id}` })
  }

  private async getWorkers() {
    this.listLoading = true
    const { data } = await getServerStats()

    const total = data.worker_num

    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    const workers: IWorkerData[] = []

    for (let index = start; index < end; index++) {
      workers[index] = { id: index }
    }

    this.workers = workers
    this.total = total
    this.listLoading = false
  }
}
</script>
<style lang='scss' scoped>
.customzie {
  // @import '@/assets/style/table.scss';

  width: 100%;
  height: vh(950);
}
</style>
