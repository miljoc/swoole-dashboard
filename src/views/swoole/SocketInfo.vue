<template>
  <div class="app-container">
    <div>
      <el-descriptions
        border
        :column=1
      >
        <el-descriptions-item :label="index" v-for="(item, index) in socketInfo" :key="index">{{ handleData(index, item) }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import { getSocketInfo } from '@/api/server.ts'
import { bytesFormat } from '@/utils/index.ts'

export default {
  name: 'SocketInfo',
  components: {},
  filters: {
    bytesFormat: bytesFormat,
  },
  data() {
    return {
      socketInfo: {}
    }
  },
  mounted() {
    this.getSocketInfo()
  },
  methods: {
    async getSocketInfo() {
      const fd = this.$route.query.fd
      const worker = this.$route.query.worker ?? 'master'
      if (fd === undefined || fd.length === 0) {
        this.$message({
          type: 'error',
          message: 'Param Error!'
        })
        return false
      }
      const { data } = await getSocketInfo(fd, worker)
      this.socketInfo = data
    },
    handleData(index, item) {
      switch (index) {
        default:
          return bytesFormat(item)
      }
    }
  }
}
</script>

<style scoped>

</style>
