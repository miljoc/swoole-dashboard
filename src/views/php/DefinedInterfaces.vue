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
<!--            <router-link class="link-type"-->
<!--                         :to="{path: `/class_info/?class=${row.name}`}">{{ row.name }}-->
<!--            </router-link>-->
            {{ row.name }}
          </el-link>
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
import { getDeclaredInterfaces } from '@/api/phpinfos'
import { IDeclaredInterfaces } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private list: IDeclaredInterfaces[] = []
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
    const { data } = await getDeclaredInterfaces()
    let index = 0
    this.list = []
    console.log(data,'data')
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
