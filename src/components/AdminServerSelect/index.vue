<template>
  <div>
    <el-popover
      placement="bottom"
      trigger="click">
      <el-select ref="admin_server_select"
                 size="mini"
                 v-model="value"
                 filterable
                 allow-create
                 clearable
                 default-first-option
                 @change="selectServer"
                 @visible-change="handleVisibleChange"
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
import { getAdminServer, getAdminServerList, setAdminServerList } from '@/utils/cookies'

@Component({
  name: 'AdminServerSelect'
})
export default class extends Vue {
  data() {
    return {
      options: getAdminServerList(),
      value: getAdminServer()
    }
  }

  private showSelect(): void {
    const el = (this.$refs.admin_server_select as any).$el
    el.querySelector('input').click()
  }

  private selectServer(address: string) {
    const addressList = getAdminServerList()
    let message

    // delete
    if (address === '') {
      const delAddress = getAdminServer()

      const result = []
      for (let i = 0; i < addressList.length; i++) {
        const obj = addressList[i]
        if (obj.value !== delAddress) {
          result.push(obj)
        }
      }
      setAdminServerList(JSON.stringify(result))
      AppModule.SetAdminServerAddress(result[0] !== undefined ? result[0].value : 'http://127.0.0.1:9502/')

      message = this.$t('components.deleteAdminServerTips').toString() + delAddress
    } else {
      if (address.length <= 7 || !/http:\/\/|https:\/\//i.test(address)) {
        return this.$message({
          message: this.$t('login.address_error') as string,
          type: 'error'
        })
      }
      const newAddress = { value: address }
      if (JSON.stringify(addressList).indexOf(JSON.stringify(newAddress)) === -1) {
        addressList.push(newAddress)
      }
      setAdminServerList(addressList)
      AppModule.SetAdminServerAddress(address)
      message = this.$t('components.changeAdminServerTips').toString() + address
    }
    this.$message({
      message: message,
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
