<template>
  <div>
    <el-popover
      placement="bottom"
      trigger="click">
      <el-select ref="admin_server_select"
                 size="mini"
                 v-model="value"
                 filterable
                 default-first-option
                 @change="selectServer"
                 :popper-append-to-body="false"
                 popper-class="adminSelect"
                 :placeholder="$t('login.address')">
        <el-option
          v-for="item in options"
          :key="item.value"
          :value="item.value">
        </el-option>
      </el-select>

      <svg-icon
        name="link"
        class="international-icon"
        @click="showSelect"
        slot="reference"
      />
    </el-popover>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { getAdminServer, getAdminServerList, setAdminServerToken } from '@/utils/cookies'

@Component({
  name: 'AdminServerSelect'
})
export default class extends Vue {
  private adminList:any

  data() {
    return {
      options: this.initData(),
      value: getAdminServer()
    }
  }

  private initData() {
    const list = getAdminServerList()
    this.adminList = list
    const result = list.filter(function(item: any) {
      return item.status === 200
    })

    if (result.length === 0 && this.$route.path !== '/admin_server') {
      // goto add admin_server
      this.$router.push('/admin_server?add')
    }
    return result
  }

  private showSelect(): void {
    const el = (this.$refs.admin_server_select as any).$el
    el.querySelector('input').click()
  }

  private selectServer(address: string) {
    AppModule.SetAdminServerAddress(address)

    const nowAdminServer = this.adminList.filter(function(item: any) {
      return item.value === address
    })
    setAdminServerToken(nowAdminServer[0].token)

    this.$message({
      message: this.$t('components.changeAdminServerTips').toString() + address,
      type: 'success',
      onClose: () => {
        this.$router.go(0)
      }
    })
  }
}
</script>

<style>
.adminSelect {
  top: unset !important;
  left: -5px !important;
}
</style>
