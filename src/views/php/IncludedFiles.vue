
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
          <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getIncludedFiles } from '@/api/phpinfos'
import { IIncludedFilesData } from '@/api/types'

@Component({
  name: 'Workers'
})
export default class extends Vue {
  private files: IIncludedFilesData[] = [];
  private listLoading = true;

  created() {
    this.getIncludedFiles()
  }

  private async getIncludedFiles() {
    this.listLoading = true
    const { data } = await getIncludedFiles()

    const files: IIncludedFilesData[] = []
    for (let index = 0; index < data.files.length; index++) {
      files[index] = {
        filename: data.files[index]
      }
    }
    this.files = files
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
