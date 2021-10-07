<template>
  <div class="app-container">
      <el-row>
        <el-descriptions class="margin-top" border>
          <el-descriptions-item label="Num">{{ num }}</el-descriptions-item>
          <el-descriptions-item label="User Defined" v-if="user_defined === true ">{{ user_defined }}</el-descriptions-item>
          <el-descriptions-item label="Extension" v-if="user_defined === false ">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/extension_detail/?extension_name=${extension}`}">{{ extension }}
              </router-link>
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="Filename" v-if="tmpFilename !== '-' ">
            <el-link type="primary">
              <router-link class="link-type"
                           :to="{path: `/includedfiles_detail?file_name=${filename}&line=${line}`}">
                {{ tmpFilename }}
              </router-link>
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="filename" v-else>
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
      <el-table-column label="ParamsId" align="center" width="180" sortable="id">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ParamsName">
        <template slot-scope="scope">
          {{ scope.row.name }}
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
  methods: {
    async getDefinedFunctionsContent() {
      this.listLoading = true
      const { function_name } = this.$route.query
      const { data } = await getDefinedFunctionsContent(function_name)

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
          name: this.tmpListParams[names]
        })
        index++
      }
      this.list = tmpList
      this.listLoading = false
    }
  }
}
</script>
