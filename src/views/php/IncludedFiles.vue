
<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="files"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Filename">
        <template slot-scope="scope">
          <span style="margin-left: 10px"> {{ scope.row.filename }} </span>
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
  private data: IIncludedFilesData[] = [];
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

    if (this.data.length === 0) {
      const { data } = await getIncludedFiles()
      this.data = data.files
    }

    const total = this.data.length

    const files: IIncludedFilesData[] = []
    const start = (this.listQuery.page - 1) * this.listQuery.limit
    let end = this.listQuery.page * this.listQuery.limit

    end = Math.min(total, end)

    for (let index = start; index < end; index++) {
      files[index] = {
        id: index + 1,
        filename: this.data[index]
      }
    }

    console.dir(files, this.data)

    this.files = files
    this.total = total
    this.listLoading = false
  }
}
</script>
