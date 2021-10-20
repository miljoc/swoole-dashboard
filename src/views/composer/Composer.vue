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

      <el-input v-model="input" id="search" style="margin: 0 10px 10px 0;width: 300px;" @keyup.enter.native="searchFilter" :placeholder="$t('composer.name')"></el-input>

      <el-button type="primary" @click="searchFilter" icon="el-icon-search">{{ $t('common.search') }}</el-button>

      <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>
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
      <el-table-column :label="$t('composer.version')" width="250">
        <template slot-scope="scope">
          {{ scope.row.pretty_version }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.type')" width="250">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('composer.aliases')" width="150">
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
      <el-table-column
        align="center"
        :label="$t('common.actions')"
        width="140"
        style="text-overflow:ellipsis;overflow:hidden;"
      >
        <template slot-scope="{row}">
            <el-button type="info" size="mini" :disabled="/^__root__/.test(row.name) || row.reference === '-'" @click="dialogVisibleDiv(row)" style="float: left;">
            <svg-icon name="detail" /> {{ $t('common.detail') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getComposer"
    />

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
  private input: any = ''
  private packageName: any = ''
  private list: any = []
  private nowPackageData: any = []
  private handleAllList: any = []
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
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  private optionsName: any = []
  private optionsNameValue = ''
  private versions_data_list: any = []

  created() {
    this.getComposer()
  }

  // 搜索
  private searchFilter(): void {
    this.listQuery.page = 1
    this.input = this.input.replace(/(^\s*)|(\s*$)/g, '')
    this.setData(this.list[this.optionsValue])
  }

  // 清除
  private clearFilter(): void {
    this.input = ''
    this.setData(this.list[this.optionsValue])
  }

  private handleComposerData(packageName: string) {
    this.packageName = packageName
    this.input = ''
    this.listQuery.page = 1
    this.setData(this.list[packageName])
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
    const versions_data_name = []
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
      versions_data_name.push(names.split('/')[0])
      index++
    }

    this.versions_data_list = versions_data

    const name_data = this.newArr(versions_data_name)

    this.optionsName = []
    for (let i = 0; i < name_data.length; i++) {
      this.optionsName.push({ value: name_data[i] })
    }

    const input = this.input ? this.input : this.optionsNameValue

    this.handleAllList = JSON.parse(JSON.stringify(versions_data))

    if (input.length > 0) {
      const arr:any = []
      for (let i = 0; i < versions_data.length; i++) {
        if (versions_data[i].name.indexOf(input) >= 0) {
          arr.push(versions_data[i].name)
        }
      }

      const tmpList:any = []
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          tmpList.push(this.handleAllList.filter((item: any) => {
            let mark = true
            if (item.name !== arr[i]) {
              mark = false
            }
            return mark
          })[0])
        }

        const list_s = []
        for (let i = 0; i < tmpList.length; i++) {
          list_s.push({
            name: tmpList[i].name,
            version: tmpList[i].version,
            id: i + 1,
            aliases: tmpList[i].aliases,
            dev_requirement: tmpList[i].dev_requirement,
            install_path: tmpList[i].install_path,
            is_obg: tmpList[i].is_obg,
            pretty_version: tmpList[i].pretty_version,
            reference: tmpList[i].reference,
            type: tmpList[i].type
          })
        }
        this.versions_data_list = list_s
      } else {
        this.versions_data_list = []
      }
    }

    const tmpData = []
    for (const item of this.versions_data_list) {
      if (item.id >= (this.listQuery.page - 1) * this.listQuery.limit && item.id < this.listQuery.page * this.listQuery.limit) {
        tmpData.push(item)
      }
    }

    this.nowPackageData = tmpData
    this.total = this.versions_data_list.length
  }

  private newArr(array: any) {
    const arrs = []
    for (let i = 0; i < array.length; i++) {
      // 如果临时数组里没有当前数组的当前值，则把当前值push到新数组里面
      if (arrs.indexOf(array[i]) === -1) {
        arrs.push(array[i])
      }
    }
    return arrs
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
    this.options = []
    for (const package_data in data) {
      this.options.push({ value: package_data })
    }
    this.optionsValue = this.options[0]?.value || ''
    this.optionsValue = this.packageName.length > 0 ? this.packageName : this.optionsValue
    if (this.optionsValue) {
      this.setData(this.list[this.optionsValue])
    }
    this.listLoading = false
  }
}
</script>
