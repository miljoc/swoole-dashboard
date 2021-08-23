<template>
  <div>
    <el-descriptions border>
      <el-descriptions-item label="进程序号">{{ id }}</el-descriptions-item>
      <el-descriptions-item label="进程id">{{
        processID
      }}</el-descriptions-item>
      <el-descriptions-item label="内存占用">{{
        memoryUsage
      }}</el-descriptions-item>
      <el-descriptions-item label="内存实际占用">{{
        memoryRealUsage
      }}</el-descriptions-item>
      <el-descriptions-item label="连接数">{{
        connectionNumber
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getWorkerInfo, getWorkerMemoryUsage } from '@/api/workers'

export default {
  data() {
    return {
      id: -1,
      processID: -1,
      connectionNumber: -1,
      memoryUsage: -1,
      memoryRealUsage: -1
    }
  },
  created() {
    this.getWorkerID()
    this.getWorkerMemoryUsage()
  },
  methods: {
    async getWorkerID() {
      const { id } = this.$route.params
      const { data } = await getWorkerInfo(id)

      this.id = id
      this.processID = data.pid
      this.connectionNumber = Math.floor(Math.random() * 10000)
      this.memoryUsage = Math.floor(Math.random() * 100)
    },

    async getWorkerMemoryUsage() {
      const { id } = this.$route.params

      const { data } = await getWorkerMemoryUsage(id)

      const { usage, real_usage: realUsage } = data

      this.memoryUsage = usage
      this.memoryRealUsage = realUsage
    }
  }
}
</script>
