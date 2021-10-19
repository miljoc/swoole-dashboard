<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="optionsValue"
                 @change="handleComposerData"
                 style="margin: 0 10px 10px 0;"
                 placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>

    <el-row>
      <el-descriptions class="margin-top" border>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.name')">{{ root.name }}</el-descriptions-item>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.version')">{{ root.pretty_version }}</el-descriptions-item>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.devRequirement')">{{ root.dev }}</el-descriptions-item>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.aliases')">
          <span  v-if="root.aliases === '-'" >{{ root.aliases }}</span>
          <span v-else @click="mouseOver(root.aliases)"  style="color:#1890ff;">{{ root.aliases }}</span>
        </el-descriptions-item>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.type')">{{ root.type }}</el-descriptions-item>
        <el-descriptions-item v-if="showDescriptions" :label="$t('composer.reference')">{{ root.reference }}</el-descriptions-item>
        <el-descriptions-item :label="$t('composer.installPath')">{{ root.install_path }}</el-descriptions-item>
      </el-descriptions>
    </el-row>

    <el-table
      v-loading="listLoading"
      :data="nowPackageData"
      highlight-current-row
      fit
      border
      style="width: 100%; margin-top: 10px;"
    >
      <el-table-column label="Id" align="center" width="100">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.name')" >
        <template slot-scope="scope" >
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.version')" width="100">
        <template slot-scope="scope">
          {{ scope.row.pretty_version }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.type')" width="200">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.aliases')" width="100">
        <template slot-scope="scope"  >
          <span  v-if="scope.row.is_obg === '-'" >{{ scope.row.is_obg }}</span>
          <div v-else @click="mouseOver(scope.row)" >
            <span style="color:#1890ff;">{{ scope.row.is_obg }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.devRequirement')" width="100">
        <template slot-scope="scope">
          {{ scope.row.dev_requirement }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.reference')" width="400" >
        <template slot-scope="scope" >
          {{ scope.row.reference }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('common.actions')"
        width="140"
        style="text-overflow:ellipsis;overflow:hidden;"
      >
        <template slot-scope="{row}">
          <el-button type="info" size="mini" :disabled="/^__root__/.test(row.name)" @click="dialogVisibleDiv(row)" style="float: left;">
            <svg-icon name="detail" /> {{ $t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-dialog
      :title="$t('common.detail')"
      :visible.sync="dialogTableVisible"
      width="50%">
      <json-viewer style="padding: 0px 0px; !important;" :value="value_content" :expand-depth=1 copyable></json-viewer>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogTableVisible = false">{{ $t('common.close') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="$t('common.detail')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <json-viewer style="padding: 0px 0px; !important;" :value="composer_content" :expand-depth=3 copyable></json-viewer>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">{{ $t('common.close') }}</el-button>
      </span>
    </el-dialog>

  </div>

</template>

<script lang="ts">
import { getComposer } from '@/api/phpinfos'
import { Component, Vue } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import JsonViewer from 'vue-json-viewer'
import axios from 'axios'

@Component({
  name: 'Composer',
  components: {
    Pagination,
    JsonViewer
  }
})
export default class extends Vue {
  private list: any = []
  private nowPackageData: any = []
  private optionsValue = ''
  private options: any = []
  private value_content: any = ''
  private listLoading = true
  private root: any = []
  private versions: any = []
  private composer_content: any = []
  private dialogVisible = false
  private dialogTableVisible = false
  private showDescriptions = true

  created() {
    this.getComposer()
  }

  private setData(packageData: any) {
    let index = 0
    this.root = packageData.root

    if (this.root.aliases) {
      if (this.root.aliases.constructor === Array && this.root.aliases.length === 0) {
        this.root.aliases = '-'
      }
    }
    this.root.dev = this.root.dev ? this.root.dev : '-'
    this.root.type = this.root.type ? this.root.type : '-'

    this.showDescriptions = !/^__root__/.test(this.root.name)

    const versions_data = []
    this.versions = packageData.versions
    for (const names in this.versions) {
      const id = index + 1
      let value: any = '-'
      const arr = this.versions[names].aliases
      if (arr) {
        if (arr.constructor === Array && arr.length > 0) {
          value = arr
        } else {
          value = '-'
        }
      }
      versions_data.push({
        id: id,
        name: names,
        is_obg: value,
        aliases: arr,
        dev_requirement: this.versions[names].dev_requirement ? this.versions[names].dev_requirement : '-',
        install_path: this.versions[names].install_path ? this.versions[names].install_path : '-',
        pretty_version: this.versions[names].pretty_version ? this.versions[names].pretty_version : '-',
        reference: this.versions[names].reference ? this.versions[names].reference : '-',
        type: this.versions[names].type ? this.versions[names].type : '-',
        version: this.versions[names].version ? this.versions[names].version : '-'
      })
      index++
    }

    this.nowPackageData = versions_data
  }

  private handleComposerData(packageName: string) {
    this.setData(this.list[packageName])
  }

  async mouseOver(row: any) {
    this.value_content = row.aliases
    this.dialogTableVisible = true
  }

  async dialogVisibleDiv(row: any) {
    const url = 'https://repo.packagist.org/p2/' + row.name + '.json'
    this.dialogVisible = true
    axios
      .get(url)
      .then((response) => (
        this.composer_content = response.data.packages[row.name]
      )).catch(() => {
        this.composer_content = ''
      })
  }

  async handleClose(done: any) {
    done()
  }

  private async getComposer() {
    this.listLoading = true
    const { data } = await getComposer()

    this.list = data

    for (const package_data in data) {
      this.options.push({ value: package_data })
    }
    this.optionsValue = this.options[0]?.value || ''
    if (this.optionsValue) {
      this.setData(this.list[this.optionsValue])
    }
    this.listLoading = false
  }
}
</script>
