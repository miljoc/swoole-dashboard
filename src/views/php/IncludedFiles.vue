
<template>
  <div class="customzie">
    <el-table
      v-loading="listLoading"
      :data="files"
      highlight-current-row
      fit
      style="width: 100%"
    >
      <el-table-column label="文件序号" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getIncludedFiles"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getIncludedFiles } from '@/api/phpinfos'
import { IIncludedFilesData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'IncludedFiles',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private files: IIncludedFilesData[] = [];
  private total = 0
  private listLoading = true;
  private listQuery = {
    page: 1,
    limit: 20
  }

  created() {
    this.getIncludedFiles()
  }

  private async getIncludedFiles() {
    console.log(this.listQuery)
    this.listLoading = true
    const { data } = await getIncludedFiles()

    const total = data.files.length

    const files: IIncludedFilesData[] = []
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit - 1

    end = Math.min(total, end)

    for (let index = start; index < end; index++) {
      files[index] = {
        id: index + 1,
        filename: data.files[index]
      }
    }
    this.files = files
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
