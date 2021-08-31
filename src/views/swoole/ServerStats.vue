<template>
  <div>
    <el-descriptions border>
      <el-descriptions-item label="关闭连接数量">{{
        serverStats.close_count
      }}</el-descriptions-item>
      <el-descriptions-item label="接收连接数量">{{
        serverStats.accept_count
      }}</el-descriptions-item>
      <el-descriptions-item label="协程数">{{
        serverStats.coroutine_num
      }}</el-descriptions-item>
      <el-descriptions-item label="dispatch数量">{{
        serverStats.dispatch_count
      }}</el-descriptions-item>
      <el-descriptions-item label="空闲进程数量">{{
        serverStats.idle_worker_num
      }}</el-descriptions-item>
      <el-descriptions-item label="请求数量">{{
        serverStats.request_count
      }}</el-descriptions-item>
      <el-descriptions-item label="服务器启动时间">{{
        serverStats.start_time
      }}</el-descriptions-item>
      <el-descriptions-item label="taskWorker进程数量">{{
        serverStats.task_worker_num
      }}</el-descriptions-item>
      <el-descriptions-item label="taskingNum数量">{{
        serverStats.tasking_num
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程dispatch数量">{{
        serverStats.worker_dispatch_count
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程数量">{{
        serverStats.worker_num
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程请求数量">{{
        serverStats.worker_request_count
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { getServerStats } from '@/api/server'

export default {
  data() {
    return {
      serverStats: {
        close_count: -1,
        accept_count: -1,
        connection_num: -1,
        coroutine_num: -1,
        dispatch_count: -1,
        idle_worker_num: -1,
        request_count: -1,
        start_time: -1,
        task_worker_num: -1,
        tasking_num: -1,
        worker_dispatch_count: -1,
        worker_num: -1,
        worker_request_count: -1
      }
    }
  },
  created() {
    this.getServerStats()
  },
  methods: {
    async getServerStats() {
      const { data } = await getServerStats()

      this.serverStats = data
    }
  }
}
</script>
