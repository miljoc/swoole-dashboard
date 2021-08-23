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
      <el-descriptions-item label="协程信息"
        ><el-button type="text" @click="showCoroutineStats = true"
          >查看</el-button
        ></el-descriptions-item
      >
    </el-descriptions>

    <el-dialog
      title="协程信息"
      :visible.sync="showCoroutineStats"
      width="100%"
      :before-close="handleClose"
    >
      <el-descriptions border>
        <el-descriptions-item label="aio task 数量">{{ coroutineStats.aioTaskNum }}</el-descriptions-item>
        <el-descriptions-item label="aio worker 数量">{{ coroutineStats.aioWorkerNum }}</el-descriptions-item>
        <el-descriptions-item label="C栈大小">{{ coroutineStats.cStackSize }}</el-descriptions-item>
        <el-descriptions-item label="当前协程数量">{{ coroutineStats.coroutineNum }}</el-descriptions-item>
        <el-descriptions-item label="最后一个协程的id">{{ coroutineStats.coroutineLastCid }}</el-descriptions-item>
        <el-descriptions-item label="协程的峰值">{{ coroutineStats.coroutinePeakNum }}</el-descriptions-item>
        <el-descriptions-item label="事件数">{{ coroutineStats.eventNum }}</el-descriptions-item>
        <el-descriptions-item label="信号监听数量">{{ coroutineStats.signalListenerNum }}</el-descriptions-item>
    </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getWorkerInfo, getCoroutineStats, getWorkerMemoryUsage } from '@/api/workers'

export default {
  data() {
    return {
      showCoroutineStats: false,
      id: -1,
      processID: -1,
      connectionNumber: -1,
      memoryUsage: -1,
      memoryRealUsage: -1,
      coroutineStats: {
        aioTaskNum: -1,
        aioWorkerNum: -1,
        cStackSize: -1,
        coroutineLastCid: -1,
        coroutineNum: -1,
        coroutinePeakNum: -1,
        eventNum: -1,
        signalListenerNum: -1
      }
    }
  },
  created() {
    this.getWorkerInfo()
    this.getCoroutineStats()
    this.getWorkerMemoryUsage()
  },
  methods: {
    async getWorkerInfo() {
      const { id } = this.$route.params
      const { data } = await getWorkerInfo(id)

      this.id = id
      this.processID = data.pid
      this.connectionNumber = Math.floor(Math.random() * 10000)
      this.memoryUsage = Math.floor(Math.random() * 100)
    },

    async getCoroutineStats() {
      const { id } = this.$route.params
      const { data } = await getCoroutineStats(id)

      this.coroutineStats.aioTaskNum = data.aio_task_num
      this.coroutineStats.aioWorkerNum = data.aio_worker_num
      this.coroutineStats.cStackSize = data.c_stack_size
      this.coroutineStats.coroutineNum = data.coroutine_num
      this.coroutineStats.coroutineLastCid = data.coroutine_last_cid
      this.coroutineStats.coroutinePeakNum = data.coroutine_peak_num
      this.coroutineStats.eventNum = data.event_num
      this.coroutineStats.signalListenerNum = data.signal_listener_num
    },

    async getWorkerMemoryUsage() {
      const { id } = this.$route.params

      const { data } = await getWorkerMemoryUsage(id)

      const { usage, real_usage: realUsage } = data

      this.memoryUsage = usage
      this.memoryRealUsage = realUsage
    },

    handleClose(done) {
      done()
    }
  }
}
</script>
