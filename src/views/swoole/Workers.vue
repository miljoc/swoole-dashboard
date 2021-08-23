
<template>
  <div class="customzie">
    <el-table
      v-loading="listLoading"
      :data="workers"
      highlight-current-row
      fit
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getServerStats } from "@/api/server";
import { IWorkerData } from "@/api/types";

@Component({
  name: "Workers",
})
export default class extends Vue {
  private workers: IWorkerData[] = [];
  private listLoading = true;

  created() {
    this.getWorkers();
  }

  private handleEdit(row: any) {
    this.$router.push({ path: `/worker/${row.id}` });
  }

  private async getWorkers() {
    this.listLoading = true;
    const { data } = await getServerStats();

    let workers: IWorkerData[] = new Array();
    for (let index = 0; index < data.worker_num; index++) {
      workers[index] = { id: index };
    }
    this.workers = workers;
    this.listLoading = false;
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
