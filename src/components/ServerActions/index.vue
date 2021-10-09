<template>
  <el-dropdown trigger="click">
  <span class="el-dropdown-link">
    <svg-icon name="server" />
  </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>
        <div @click="handleConfirm(1)">
          <svg-icon name="reload" /> {{ this.$t('common.reload').toString() }}
        </div>
      </el-dropdown-item>
      <el-dropdown-item divided>
        <div @click="handleConfirm(2)">
          <svg-icon name="shutdown" /> {{ this.$t('common.shutDown').toString() }}
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script  lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { serverReload, serverShutDown } from '@/api/server'

@Component({
  name: 'ServerActions'
})
export default class extends Vue {
  private handleConfirm(type = 1) {
    let str = ''
    let confirmButtonText = ''
    switch (type) {
      case 1:
        str = this.$t('common.reloadWarning').toString()
        confirmButtonText = this.$t('common.reload').toString()
        break
      case 2:
        str = this.$t('common.shutDownWarning').toString()
        confirmButtonText = this.$t('common.shutDown').toString()
        break
      default:
        return false
    }

    const cancelButtonText = this.$t('common.cancel').toString()
    this.$confirm(str, {
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      type: 'warning'
    })
      .then(() => {
        switch (type) {
          case 1:
            this.reload()
            break
          case 2:
            this.shutdown()
            break
        }
      }).catch(() => {
      // console.log(this.list)
      })
  }

  private async reload() {
    await serverReload()
    this.$message({
      message: this.$t('common.reloadSuccess').toString(),
      type: 'success'
    })
    setTimeout((this.$router.go(0) as any), 1000)
  }

  private shutdown() {
    serverShutDown()
    this.$message({
      message: this.$t('common.shutDownSuccess').toString(),
      type: 'success'
    })
    setTimeout((this.$router.go(0) as any), 1000)
  }
}
</script>
