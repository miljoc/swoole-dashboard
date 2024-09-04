<template>
  <div class="app-container">
    <!--    class_name-->
    <el-table
      v-if="type === 'classes'"
      v-loading="listLoading"
      :data="class_list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" align="center">
        <template slot-scope="scope">
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/class_info?class_name=${scope.row.name}`}">{{ scope.row.name }}
            </router-link>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="type === 'constants'"
      v-loading="listLoading"
      :data="constant_list"
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
      :data="ini_entrie_list"
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
      :data="dependencie_list"
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
      :data="function_list"
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
<<<<<<< HEAD
          <el-link type="primary">
            <router-link class="link-type"
                         :to="{path: `/function_info?function_name=${scope.row.name}`}">{{ scope.row.name }}
            </router-link>
          </el-link>
=======
          <span>{{ scope.row.name }}</span>
>>>>>>> parent of 3161e03 (Add Login (#9))
        </template>
      </el-table-column>
    </el-table>

    <!--    info-->
    <p v-if="type === 'info'">
      <el-input
        type="textarea"
        autosize
        spellcheck="false"
        :value="info">
      </el-input>
    </p>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getExtensionDetail } from '@/api/phpinfos'
import Pagination from '@/components/Pagination/index.vue'
import { bytesFormat, parseTime } from '@/utils'

@Component({
  name: 'ExtensionInfo',
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
  @Prop({ default: 'classes' }) private type!: string
  private version = ''
  private info = ''
  private class_list: any = []
  private function_list: any = []
  private constant_list: any = []
  private ini_entrie_list: any = []
  private dependencie_list: any = []
  private listLoading = true

  created() {
    this.getExtensionDetail()
  }

  private async getExtensionDetail() {
    this.listLoading = true

    const { extension_name } = this.$route.query
    const { data } = await getExtensionDetail(extension_name || 'Core')

    let index = 0
    this.class_list = []
    this.function_list = []
    this.constant_list = []
    this.dependencie_list = []
    this.ini_entrie_list = []

    switch (this.type) {
      case 'classes':
        for (const name of data.classes) {
          const id = index++
          this.class_list.push({
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
          this.constant_list.push({
            id: id + 1,
            name: name,
            value: data.constants[name]
          })
        }
        break
      case 'iniEntries':
        for (const name in data.ini_entries) {
          const id = index++
          this.ini_entrie_list.push({
            id: id + 1,
            name: name,
            value: data.ini_entries[name]
          })
        }
        break
      case 'dependencies':
        for (const name in data.dependencies) {
          const id = index++
          this.dependencie_list.push({
            id: id + 1,
            name: name,
            value: data.dependencies[name]
          })
        }
        break
      case 'functions':
        for (const name of data.functions) {
          const id = index++
          this.function_list.push({
            name: name,
            id: id + 1
          })
        }
        break
      case 'info': {
        this.info = data.info
        break
      }
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
