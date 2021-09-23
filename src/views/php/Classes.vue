<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        width="100%"
    >
      <el-table-column
          align="center"
          label="ID"
          width="200"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Name"
      >
        <template slot-scope="{row}">
          <el-link type="primary">
          <router-link class="link-type"
                       :to="{path: `/class_info/?class_name=${row.name}`}">{{ row.name }}
          </router-link>
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
          align="center"
          label="Actions"
          width="200"
      >
        <template slot-scope="{row}">
          <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
          >
            Ok
          </el-button>
          <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
          >
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getDeclaredClasses } from '@/api/phpinfos'
import { IDeclaredClass } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private list: IDeclaredClass[] = []
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getDeclaredClasses()
    let index = 0
    this.list = []
    for (const name of data) {
      const id = index++
      if (id >= (this.listQuery.page - 1) * this.listQuery.limit && id < this.listQuery.page * this.listQuery.limit) {
        this.list.push({
          name: name,
          id: id
        })
      }
    }
    this.total = data.length

    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private cancelEdit(row: any) {
    row.title = row.originalTitle
    row.edit = false
    this.$message({
      message: 'The title has been restored to the original value',
      type: 'warning'
    })
  }

  private confirmEdit(row: any) {
    row.edit = false
    row.originalTitle = row.title
    this.$message({
      message: 'The title has been edited',
      type: 'success'
    })
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
