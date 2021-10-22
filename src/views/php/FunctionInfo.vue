<template>
  <div class="app-container">

    <el-divider content-position="left">{{ desc }}</el-divider>

    <el-row>
        <el-descriptions class="margin-top" border>
          <el-descriptions-item :label="$t('function_info.num')">{{ num }}</el-descriptions-item>
          <el-descriptions-item :label="$t('function_info.user_defined')" v-if="user_defined === true ">{{ user_defined }}</el-descriptions-item>
          <el-descriptions-item :label="$t('function_info.extension')" v-if="user_defined === false ">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/extension_info/?extension_name=${extension}`}">{{ extension }}
              </router-link>
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('function_info.filename')" v-if="tmpFilename !== '-' ">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/included_file_info?file_name=${filename}&line=${line}`}">
                {{ tmpFilename }}
              </router-link>
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('function_info.filename')" v-else>
                {{ tmpFilename }}
          </el-descriptions-item>
        </el-descriptions>
      </el-row>
    <el-table
      v-loading="listLoading"
      :data="params"
      highlight-current-row
      fit
      border
      style="width: 100%; margin-top: 2%;"
    >
      <el-table-column label="Id" align="center" width="180" >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.optional')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.optional === '?' ">true</span>
          <span v-else>false</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.type')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.type === '' ">-</span>
          <span v-else>{{ scope.row.data.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.variadic')">
        <template slot-scope="scope" >
          <span v-if="scope.row.data.is_variadic === '...' ">true</span>
          <span v-else>false</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.by_reference')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.is_passed_by_reference === '&' ">true</span>
          <span v-else>false</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.name')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.name === '' ">-</span>
          <span v-else>${{ scope.row.data.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.default')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.default === '' ">-</span>
          <span v-else>{{ scope.row.data.default | substr }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('function_info.full')">
        <template slot-scope="scope">
          <span v-if="scope.row.data.full === '' ">-</span>
          <span v-else>{{ scope.row.data.full }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDefinedFunctionsContent } from '@/api/phpinfos'

export default {
  data() {
    return {
      desc: '',
      list: [],
      params: [],
      filename: '',
      line: 0,
      num: '',
      user_defined: '',
      extension: '',
      tmpFilename: ''
    }
  },
  created() {
    this.getDefinedFunctionsContent()
  },
  filters: {
    substr(val) {
      return val.substr(2)
    }
  },
  methods: {
    async getDefinedFunctionsContent() {
      this.listLoading = true
      const { class_name } = this.$route.query
      const { function_name } = this.$route.query
      this.desc = (class_name !== undefined ? class_name + '\\' : '') + function_name
      const { data } = await getDefinedFunctionsContent(class_name, function_name)

      let index = 0
      const tmpList = []

      if (data.line === false || data.filename === false) {
        this.tmpFilename = '-'
      } else {
        this.tmpFilename = data.filename + ':' + data.line
      }
      this.filename = data.filename
      this.line = data.line
      this.num = data.num
      this.user_defined = data.user_defined
      this.extension = data.extension
      this.tmpListParams = data.params

      for (const names in this.tmpListParams) {
        const id = index + 1
        this.params.push({
          id: id,
          data: this.tmpListParams[names]
        })
        index++
      }
      this.list = tmpList
      this.listLoading = false
    }
  }
}
</script>
