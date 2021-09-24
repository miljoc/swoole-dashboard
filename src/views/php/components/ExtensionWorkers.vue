<template>
  <div class="app-container">

<!--    class_name-->
    <el-table
        v-if="type === 'class_name'"
        v-loading="listLoading"
        :data="list"
        highlight-current-row
        fit
        border
        style="width: 100%"
    >
      <el-table-column label="ID" align="center" v-if="type === 'class_name'">
        <template slot-scope="scope">
          <span>{{ scope.row.id + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" v-if="type === 'class_name'">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
<!--    version-->
    <p v-if="type == 'version'">Version : {{ version }}</p>

<!--    constants-->
    <el-table
      v-if="type === 'constants'"
      v-loading="listLoading"
      :data="constants_list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Value" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

<!--    iniEntries-->
    <el-table
      v-if="type === 'iniEntries'"
      v-loading="listLoading"
      :data="ini_entries_list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Value" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

<!--    dependencies-->
    <el-table
      v-if="type === 'dependencies'"
      v-loading="listLoading"
      :data="dependencies_list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Value" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>

<!--    function-->
    <el-table
      v-if="type === 'functions'"
      v-loading="listLoading"
      :data="functions_list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" v-if="type === 'functions'">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center" v-if="type === 'functions'">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
    </el-table>

<!--    info-->
    <p v-if="type == 'info'"></p>
    <p v-html="info"></p>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import {getExtensionDetail, getLoadedExtensions} from '@/api/phpinfos'
import { IExtensionInfo } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import request from '@/utils/request'
import { bytesFormat, parseTime } from '@/utils'

@Component({
  name: 'Workers',
  components: {
    Pagination
  },
  filters: {
    bytesFormat: bytesFormat,
    parseTime: parseTime,
    toBytes: (bytes: string) => {
      if (bytes.substring(bytes.length - 2, bytes.length) === 'kB') {
        return parseInt(bytes.substring(0, bytes.length - 3), 10) * 1024
      } else {
        return parseInt(bytes, 10)
      }
    }
  }
})

export default class extends Vue {
  @Prop({ default: 'class_name' }) private type!: string
  private workers: IExtensionInfo[] = []
  private total = 0
  private version = ''
  private info = ''
  private list:any = []
  private functions_list:any = []
  private constants_list:any = []
  private ini_entries_list:any = []
  private dependencies_list:any = []
  private listLoading = true

  created() {
    this.getExtensionDetail()
  }

  private async getExtensionDetail() {
    this.listLoading = true

    const { extension_name } = this.$route.query
    const { data } = await getExtensionDetail(extension_name)
    let index = 0
    let info = ''
    this.list = []
    this.functions_list = []
    this.constants_list = []
    this.dependencies_list = []
    this.ini_entries_list = []

    switch (this.type) {
      case 'class_name':
        for (const name of data.class_name) {
          const id = index++
            this.list.push({
              name: name,
              id: id
            })
        }
        break
      case 'version':
        this.version = data.version
        break
      case 'constants':
        for (const name in data.constants) {
          const id = index++
          this.constants_list.push({
            id: id + 1,
            name: name,
            value: data.constants[name]
          })
        }
        break
      case 'iniEntries':
        for (const name in data.ini_entries) {
          const id = index++
          this.ini_entries_list.push({
            id: id + 1,
            name: name,
            value: data.ini_entries[name]
          })
        }
        break
      case 'dependencies':
        for (const name in data.dependencies) {
          const id = index++
          this.dependencies_list.push({
            id: id + 1,
            name: name,
            value: data.dependencies[name]
          })
        }
        break
      case 'functions':
        for (const name of data.functions) {
          const id = index++
          this.functions_list.push({
            name: name,
            id: id + 1
          })
        }
        break
      case 'info':
        let info = data.info.replace(/(\r\n)|(\n)/g, '<br>')
        this.info = info.trim('<br>')
        break
      default:
        break
    }
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

}
</script>
