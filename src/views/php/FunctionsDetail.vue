<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      highlight-current-row
      fit
      border
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="180" sortable="id">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Value">
        <template slot-scope="scope" >
          {{ scope.row.value }}

        </template>
  <!--      <template slot-scope="scope" v-if="typeof(scope.row.name) === Object ">-->
  <!--        1111-->
  <!--      </template>-->
  <!--      <template slot-scope="scope" v-else>-->
  <!--        2222-->
  <!--      </template>-->
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getDefinedFunctionsContent } from '@/api/phpinfos'

export default {
  name: 'SwooleEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      list: []
    }
  },
  mounted() {
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
      for (const name in data) {
        const id = index
        let value = data[name]
        if (name === 'params') {
          value = JSON.parse(data.params).join(', ')
        }
        tmpList.push({
          name: name,
          id: id + 1,
          value: value
        })
        index++
      }
      this.list = tmpList
      this.listLoading = false
    }
  }
}
</script>
