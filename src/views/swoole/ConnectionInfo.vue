<template>
  <div class="app-container">
    <div>
      <el-descriptions
        border
        :column=2
        :label-style="{
          'width': '10%'
        }"
      >
        <el-descriptions-item :label="index" v-for="(item, index) in connectionInfo" :key="index">{{ handleData(index, item) }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getClientInfo } from '@/api/server'
import { bytesFormat, parseTime, socketTypeFilter } from '@/utils/index'

@Component({
  name: 'ConnectionInfo',
  components: {},
  filters: {
    bytesFormat: bytesFormat,
    parseTime: parseTime
  }
})
export default class extends Vue {
  private connectionInfo = {}

  mounted() {
    this.getConnectionInfo()
  }

  private async getConnectionInfo() {
    const session_id = (this.$route.query.session_id) as string
    const worker = (this.$route.query.worker ?? 'master') as string
    if (session_id.length === 0) {
      this.$message({
        type: 'error',
        message: 'Param Error!'
      })
      return false
    }
    const { data } = await getClientInfo(worker, session_id)
    if (data === false) {
      const str = this.$t('connections.closedWarning').toString()
      this.$message({
        type: 'error',
        message: str
      })
    }
    this.connectionInfo = data
  }

  private handleData(index: string, item: any) {
    switch (index) {
      case 'socket_type':
        return socketTypeFilter(item)
      case 'connect_time':
        return parseTime(item, '{h}:{i}:{s}.{M}')
      case 'last_time':
        return parseTime(item, '{h}:{i}:{s}.{M}')
      case 'last_recv_time':
        return parseTime(item, '{h}:{i}:{s}.{M}')
      case 'last_send_time':
        return parseTime(item, '{h}:{i}:{s}.{M}')
      case 'last_dispatch_time':
        return parseTime(item, '{h}:{i}:{s}.{M}')
      case 'recv_queued_bytes':
        return bytesFormat(item)
      case 'send_queued_bytes':
        return bytesFormat(item)
      default:
        return item
    }
  }
}
</script>

<style scoped>

</style>
