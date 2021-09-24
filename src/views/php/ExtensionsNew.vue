<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="tmpData"
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
                         :to="{path: `/extension_detail/?extension_name=${row.name}`}">{{ row.name }}
            </router-link>
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
import { getLoadedExtensions  } from '@/api/phpinfos'
import { IDeclaredInterfaces, IDefinedFunction } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'InlineEditTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private list: IDeclaredInterfaces[] = []
  private tmpData: IDefinedFunction[] = []
  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  created() {
    this.getList()
  }

  private async getData() {
    const { data } = await getLoadedExtensions()
    let index = 0
    for (const name in data) {
      const id = index++
      this.list.push({
        id: id,
        name: data[name],
      })
    }
    this.total = this.list.length
  }

  private async getList() {
    this.listLoading = true

    if (this.list.length === 0) {
      await this.getData()
    }

    this.tmpData = []

    for (const item of this.list) {
      if (item.id >= (this.listQuery.page - 1) * this.listQuery.limit && item.id < this.listQuery.page * this.listQuery.limit) {
        this.tmpData.push(item)
      }
    }

    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.3 * 1000)
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
