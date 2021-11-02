<template>
  <div class="app-container">
    <!---------------------------查询------开始----------------------->
    <el-input
      v-model="search"
      :placeholder="$t('admin_server_group.placeholder')"
      @keyup.enter.native="filterHandler"
      style="margin: 0 10px 10px 0;width: 20%;"
    ></el-input>
    <el-button type="primary" @click="filterHandler" icon="el-icon-search">{{ $t('common.search') }}</el-button>
    <el-button type="default" style="color:#909399;" @click="clearFilter"><svg-icon name="clean" /> {{ $t('common.clear') }}</el-button>

    <el-button style="float: right;" type="success" @click="showAdd" icon="el-icon-plus">{{ $t('admin_server_group.admin_add') }}</el-button>
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
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server_group.group_name')"
      >
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        :label="$t('admin_server_group.actions')"
      >
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: row; justify-content: center">
            <el-button type="primary" size="mini" @click="handleGroupEdit(scope.row)" :disabled="scope.row.permission === 2 ? false : true">
              <svg-icon name='edit' />
              {{ $t('admin_server_group.group_edit') }}
            </el-button>
            <el-button type="danger" size="mini" @click="handleGroupDel(scope.row)" :disabled="scope.row.permission === 2 ? false : true">
              <svg-icon name='close' />
              {{ $t('admin_server_group.group_del') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      :visible.sync="outerVisible"
      width="70%"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="Group Name">
          <el-input v-model="form.name" style="width: 80%;"></el-input>
        </el-form-item>

        <el-form-item label="Server List">
          <el-transfer
            filterable
            v-model="serverListPick"
            :props="{
              key: 'id',
              label: 'admin_server_url'
            }"
            :data="serverList">
          </el-transfer>
        </el-form-item>

        <el-dialog
          :title="$t('admin_server_group.search_title')"
          width="50%"
          :visible.sync="innerVisible"
          append-to-body
        >
          <el-form-item :label="$t('admin_server_group.phone')">
            <div style="display: flex;">
              <el-input v-model="findUserPhone" style="width: 60%;margin-right: 10px"></el-input>
              <el-button type="primary" @click="findUser" style="width: 20%;">{{ $t('admin_server_group.search') }}</el-button>
            </div>
          </el-form-item>

        </el-dialog>

        <el-form-item :label="$t('admin_server_group.group_name')">
          <el-table
            :data="userData"
            style="width: 80%">
            <el-table-column
              label="name"
              width="180">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('admin_server_group.phone')"
              width="180">
              <template slot-scope="scope">
                {{ scope.row.phone }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('admin_server_group.actions')">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.permission" label="1">{{ $t('admin_server_group.readonly') }}</el-radio>
                <el-radio v-model="scope.row.permission" label="2">{{ $t('admin_server_group.readwrite') }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-button type="success" style="margin-left: 20px;" @click="innerVisible = true">{{ $t('admin_server_group.admin_add') }}</el-button>
              </template>
              <template slot-scope="scope">
                <el-button @click="delUser(scope.$index)" type="danger">{{ $t('admin_server_group.group_del') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('admin_server_group.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('admin_server_group.confirm') }}</el-button>
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
import { getSortFun } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import {
  createGroup,
  delGroup,
  detailGroup,
  findUserByPhone,
  getServerGroupList,
  getServerList,
  updateGroup
} from '@/api/server'
import Cookies from 'js-cookie'

@Component({
  name: 'AdminServer',
  components: {
    Pagination
  }
})

export default class extends Vue {
  private outerVisible = false
  private innerVisible = false

  private lang = ''
  private allList: any = [] // 接口返回原始数据
  private handleAllList: any = [] // 处理处理后所有数据
  private list: any = [] // 当前页显示数据

  private oldName = ''
  private serverListPick: any = []
  private serverList: any = []
  private userData:any = []
  private findUserPhone = ''

  private listLoading = true
  private total = 0
  private listQuery = {
    page: 1,
    limit: 10
  }

  // 搜索
  private search = ''

  // 弹出框
  private title = this.$t('admin_server.title')
  private form: any = {}

  created() {
    this.lang = Cookies.get('language') || 'en'
    this.getData()
    this.getServerList()
  }

  /**
   * 获取数据
   * @private
   */
  private async getData() {
    this.listLoading = true
    const { data } = await getServerGroupList()

    this.allList = JSON.parse(JSON.stringify(data))
    this.handleAllList = data
    this.showList(this.handleAllList)
    this.total = this.handleAllList.length
    this.listLoading = false
  }

  private async getServerList() {
    const { data } = await getServerList()
    this.serverList = data
  }

  /**
   * 显示弹出框
   * @private
   */
  private showAdd() {
    this.outerVisible = true
    this.form = {}
    this.userData = []
    this.serverListPick = []
  }

  /**
   * 关闭弹框
   * @private
   */
  private cancel() {
    this.outerVisible = false
  }

  private async findUser() {
    console.log(this.findUserPhone)
    const phone = this.findUserPhone
    if (phone.length !== 11) {
      const str = this.$t('admin_server_group.phone_error') as string
      this.$message({ type: 'error', message: str })
      return
    }
    const param: any = {
      lang: this.lang,
      phone: phone
    }
    const { data } = await findUserByPhone(param)
    this.userData.push({
      uid: data.uid,
      name: data.nickname,
      phone: data.mobile,
      permission: '1'
    })
    this.innerVisible = false
    this.findUserPhone = ''
  }

  /**
   * 删除用户列表数据
   * @param index
   * @private
   */
  private delUser(index: any) {
    this.userData.splice(index, 1)
  }

  /**
   * 提交表单
   * @private
   */
  private async submit() {
    // 校验参数
    if (this.form.name === undefined) {
      const str = this.$t('admin_server_group.error') as string
      this.$message({ type: 'error', message: str })
      return
    }

    if (this.oldName.length > 0) {
      // 编辑
      const param = {
        lang: this.lang,
        name: this.oldName,
        new_name: this.form.name,
        server_ids: this.serverListPick,
        users: this.userData
      }
      await updateGroup(param)
    } else {
      // 新增
      const param = {
        lang: this.lang,
        name: this.form.name,
        server_ids: this.serverListPick,
        users: this.userData
      }
      await createGroup(param)
    }

    const str = this.$t('admin_server_group.success') as string
    this.$message({
      type: 'success',
      message: str
    })
    this.outerVisible = false
    this.innerVisible = false
    location.reload()
  }

  /**
   * 处理显示详情
   * @param row
   * @private
   */
  private async handleGroupEdit(row: any) {
    const param: any = {
      lang: this.lang,
      id: row.id
    }
    const { data } = await detailGroup(param)
    this.form.name = data.group_name
    this.serverListPick = data.server_ids
    this.userData = data.users
    this.oldName = data.group_name
    this.outerVisible = true
  }

  /**
   * 删除询问
   * @param res
   * @private
   */
  private handleGroupDel(res: any) {
    let str = ''
    let confirmButtonText = ''
    str = this.$t('admin_server_group.delWarning').toString()
    confirmButtonText = this.$t('admin_server_group.delText').toString()
    const cancelButtonText = this.$t('admin_server_group.cancel').toString()
    this.$confirm(str, {
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      type: 'warning'
    })
      .then(() => {
        this.groupDel(res.id)
      }).catch(() => {
        // console.log(this.list)
      })
  }

  private async groupDel(id: any) {
    const data: any = {
      lang: this.lang,
      id: id
    }
    await delGroup(data)
    const str = this.$t('admin_server_group.success') as string
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
      this.handleAllList = this.handleAllList.filter((item: any) => {
        const tmpStr = this.search.toLowerCase() as string
        if (item.group_name.toLowerCase().indexOf(tmpStr) !== -1) {
          return true
        } else {
          return false
        }
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
    if (this.search.length > 0) {
      console.log('清除筛选项')
      this.search = ''
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
    if (this.search.length === 0) {
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
