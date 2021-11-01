<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <el-input
      v-model="search"
      :placeholder="$t('admin_server.placeholder')"
      @keyup.enter.native="filterHandler"
      style="margin: 0 10px 10px 0;width: 20%;"
    ></el-input>
    <el-select
      v-model="urlFieldValue"
      multiple
      collapse-tags
      :placeholder="$t('admin_server.admin_server_url')"
      style="margin: 0 10px 10px 0;"
      filterable
    >
      <el-option
        v-for="item in urlOptions"
        :label="item"
        :key="item"
        :value="item">
      </el-option>
    </el-select>
    <el-select
      v-model="groupFieldValue"
      multiple
      collapse-tags
      :placeholder="$t('admin_server.admin_server_group')"
      style="margin: 0 10px 10px 0;"
      filterable
    >
      <el-option
        v-for="item in groupOptions"
        :label="item.group_name"
        :key="item.id"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button type="primary" @click="filterHandler" icon="el-icon-search">{{ $t('common.search') }}</el-button>
    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>

    <el-button style="float: right;" type="success" ref="showAdd" @click="showAdd" icon="el-icon-plus">{{ $t('admin_server.admin_add') }}</el-button>
    <!---------------------------查询------结束----------------------->

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      width="100%"
      @sort-change="sortChange"
    >
      <el-table-column
        align="center"
        label="ID"
        width="200"
        sortable="id"
      >
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server.server_name')"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server.server_server_url')"
      >
        <template slot-scope="{row}">
          <span>{{ row.admin_server_url }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server.access_token')"
      >
        <template slot-scope="{row}">
          <span>{{ row.access_token }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server.remark')"
      >
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('common.status')"
      >
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 200" type="success">online</el-tag>
          <el-tag v-else type="danger">offline</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server.actions')"
      >
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <el-button type="danger" size="mini" @click="handleServerDel(scope.row)" :disabled="scope.row.permission === 2 ? false : true">
              <svg-icon name='close' />
              {{ $t('admin_server.server_del') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
    >
      <el-form :model="form" label-width="150px">
        <el-form-item>
          <span slot="label">Name <span style="color: red">*</span></span>
          <el-input v-model="form.name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label">Admin Server Url <span style="color: red">*</span></span>
          <el-input v-model="form.admin_server_url" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="access_name">
          <el-input v-model="form.access_name" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="access_secret">
          <el-input v-model="form.access_secret" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="remark">
          <el-input v-model="form.remark" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('admin_server.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('admin_server.confirm') }}</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="jumpPage"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { getSortFun, inArray } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import { getServerGroupList, getServerList, serverCreate, serverDel } from '@/api/server'
import { setAdminServerList } from '@/utils/cookies'
import Cookies from 'js-cookie'
import axios from 'axios'

@Component({
  name: 'AdminServer',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private allList: any[] = [] // 接口返回原始数据
  private handleAllList: any[] = [] // 处理处理后所有数据
  private list: any[] = [] // 当前页显示数据

  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 筛选项数据
  private urlFieldValue: Array<string> = []
  private urlOptions: any = []
  private groupFieldValue: Array<string> = []
  private groupOptions: any = []

  // 搜索
  private search = ''

  // 弹出框
  private title = this.$t('admin_server.title')
  private dialogVisible = false
  private form: any = {}

  created() {
    this.getData()
  }

  /**
   * 发送请求
   * @private
   */
  private async getServerList() {
    const { data } = await getServerList()
    const admin_server_list = []
    if (data.length > 0) {
      for (const admin_server of data) {
        const url = admin_server.admin_server_url + 'api/get_version_info/master'
        await axios({
          headers: {
            'X-Admin-Server-Access-Token': admin_server.access_token
          },
          url: url
        }).then((response) => (
          admin_server.status = response.status
        )).catch(() => {
          admin_server.status = 404
        })
        admin_server_list.push({ value: admin_server.admin_server_url, token: admin_server.access_token, status: admin_server.status })
      }
    }
    setAdminServerList(admin_server_list)
    return data
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const data = await this.getServerList()

    // 筛选项数据
    const tmpUrl: Array<any> = []
    for (let index = 0; index < data.length; index++) {
      tmpUrl[index] = data[index].admin_server_url
    }

    // 去除重复值
    for (let i = 0; i < tmpUrl.length; i++) {
      if (tmpUrl.indexOf(tmpUrl[i]) === i) {
        this.urlOptions.push(tmpUrl[i])
      }
    }

    const groupList = await getServerGroupList()
    const tmpGroup: Array<any> = []
    for (let index = 0; index < groupList.data.length; index++) {
      tmpGroup[index] = {
        id: groupList.data[index].id,
        group_name: groupList.data[index].group_name
      }
    }
    // 去除重复值
    // for (let i = 0; i < tmpGroup.length; i++) {
    //   if (tmpGroup.indexOf(tmpGroup[i]) === i) {
    //     this.groupOptions.push(tmpGroup[i])
    // }
    // }
    this.groupOptions = tmpGroup
    console.log(this.groupOptions)
    // return

    this.allList = JSON.parse(JSON.stringify(data))
    this.handleAllList = data
    this.showList(this.handleAllList)
    this.total = this.handleAllList.length
    this.listLoading = false

    if (this.$route.query.add === null && this.allList.length === 0) {
      (this.$refs.showAdd as any).$el.click()
    }
  }

  /**
   * 显示弹出框
   * @private
   */
  private showAdd() {
    // this.title = 'Add Admin Server'
    this.dialogVisible = true
    this.form = {
      id: '',
      name: '',
      admin_server_url: '',
      access_token: '',
      remark: '',
      create_at: '',
      lang: ''
    }
  }

  /**
   * 关闭弹框
   * @private
   */
  private cancel() {
    this.dialogVisible = false
  }

  /**
   * 提交表单
   * @private
   */
  private async submit() {
    // 校验参数
    if (this.form.admin_server_url === undefined ||
      this.form.name === undefined
    ) {
      const str = this.$t('admin_server.error') as string
      this.$message({ type: 'error', message: str })
      return
    }

    if (this.form.admin_server_url.length <= 7 || !/http:\/\/|https:\/\//i.test(this.form.admin_server_url)) {
      return this.$message({
        message: this.$t('admin_server.address_error') as string,
        type: 'error'
      })
    }

    this.form.lang = Cookies.get('language') || 'en'
    await serverCreate(this.form)
    const str = this.$t('admin_server.success') as string
    this.$message({
      type: 'success',
      message: str
    })
    this.dialogVisible = false
    location.reload()
  }

  /**
   * 删除询问
   * @param res
   * @private
   */
  private handleServerDel(res: any) {
    let str = ''
    let confirmButtonText = ''
    str = this.$t('admin_server.delWarning').toString()
    confirmButtonText = this.$t('admin_server.delText').toString()
    const cancelButtonText = this.$t('admin_server.cancel').toString()
    this.$confirm(str, {
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      type: 'warning'
    })
      .then(() => {
        this.serverDel(res.id)
      }).catch(() => {
        // console.log(this.list)
      })
  }

  private async serverDel(id: any) {
    await serverDel(id)
    const str = this.$t('admin_server.success') as string
    this.$message({
      type: 'success',
      message: str
    })
    location.reload()
  }

  /**
   * 点击搜索过滤数据
   * @private
   */
  private filterHandler() {
    this.handleAllList = JSON.parse(JSON.stringify(this.allList))

    if (this.search.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        const tmpStr = this.search.toLowerCase()
        if (item.name.toLowerCase().indexOf(tmpStr) !== -1 || item.admin_server_url.toLowerCase().indexOf(tmpStr) !== -1) {
          return true
        } else {
          return false
        }
      })
    }

    if (this.urlFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        return inArray(item.admin_server_url, this.urlFieldValue)
      })
    }

    if (this.groupFieldValue.length > 0) {
      this.handleAllList = this.handleAllList.filter((item) => {
        for (const v of this.groupFieldValue) {
          if (item.gids.toLowerCase().indexOf(v) !== -1) {
            return true
          }
        }
        return false
      })
    }

    this.listQuery.page = 1
    this.total = this.handleAllList.length
    this.showList(this.handleAllList)
  }

  /**
   * 清除筛选
   * @private
   */
  private clearFilter(): void {
    if (this.search.length > 0 || this.urlFieldValue.length > 0 || this.groupFieldValue.length > 0) {
      console.log('清除筛选项')
      this.search = ''
      this.urlFieldValue = []
      this.groupFieldValue = []
      this.handleAllList = JSON.parse(JSON.stringify(this.allList))
      this.showList(this.handleAllList)
      this.total = this.handleAllList.length
    }
  }

  /**
   * 点击排序
   * @param column
   */
  private sortChange(column:any) {
    const field: string = column.column.sortable // 排序字段
    if (this.search.length === 0 && this.urlFieldValue.length === 0 && this.groupFieldValue.length === 0) {
      this.handleAllList = JSON.parse(JSON.stringify(this.allList)) // 备份初始数据
    }
    if (column.order !== null) {
      const sortType: string = column.order === 'descending' ? 'desc' : 'asc' // 排序方式  desc-降序  asc-升序
      console.log('选择' + field + '-' + sortType + '排序')
      this.handleAllList = getSortFun(field, sortType, this.handleAllList) // 处理使用数据
    } else {
      console.log(field + '取消排序')
    }
    this.showList(this.handleAllList)
  }

  /**
   * 当前显示页数据
   * @param data
   * @private
   */
  private showList(data: Array<any>) {
    this.list = data.slice((this.listQuery.page - 1) * this.listQuery.limit, (this.listQuery.page - 1) * this.listQuery.limit + this.listQuery.limit)
  }

  /**
   * 数据翻页显示数据
   * @private
   */
  private jumpPage() {
    this.showList(this.handleAllList)
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
