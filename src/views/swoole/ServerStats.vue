<template>
  <div>
    <el-descriptions border>
      <el-descriptions-item label="关闭连接数量">{{
        closeCount
      }}</el-descriptions-item>
      <el-descriptions-item label="接收连接数量">{{
        acceptCount
      }}</el-descriptions-item>
      <el-descriptions-item label="协程数">{{
        coroutineNum
      }}</el-descriptions-item>
      <el-descriptions-item label="dispatch数量">{{
        dispatchCount
      }}</el-descriptions-item>
      <el-descriptions-item label="空闲进程数量">{{
        idleWorkerNum
      }}</el-descriptions-item>
      <el-descriptions-item label="请求数量">{{
        requestCount
      }}</el-descriptions-item>
      <el-descriptions-item label="服务器启动时间">{{
        startTime
      }}</el-descriptions-item>
      <el-descriptions-item label="taskWorker进程数量">{{
        taskWorkerNum
      }}</el-descriptions-item>
      <el-descriptions-item label="taskingNum数量">{{
        taskingNum
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程dispatch数量">{{
        workerDispatchCount
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程数量">{{
        workerNum
      }}</el-descriptions-item>
      <el-descriptions-item label="worker进程请求数量">{{
        workerRequestCount
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      closeCount: -1,
      acceptCount: -1,
      connectionNum: -1,
      coroutineNum: -1,
      dispatchCount: -1,
      idleWorkerNum: -1,
      requestCount: -1,
      startTime: -1,
      taskWorkerNum: -1,
      taskingNum: -1,
      workerDispatchCount: -1,
      workerNum: -1,
      workerRequestCount: -1
    }
  },
  created() {
    this.getServerStats()
  },
  methods: {
    async getServerStats() {
      const { id } = this.$route.params;
      const result = await axios.get(
        `http://127.0.0.1:9999/api/server_stats/worker-${id}`
      )

      const { code } = result.data
      if (code !== 0) {
        this.$message({
          showClose: true,
          message: result.data.data,
          type: 'error'
        })
        return
      }

      const {
        close_count: closeCount,
        accept_count: acceptCount,
        connection_num: connectionNum,
        coroutine_num: coroutineNum,
        dispatch_count: dispatchCount,
        idle_worker_num: idleWorkerNum,
        request_count: requestCount,
        start_time: startTime,
        task_worker_num: taskWorkerNum,
        tasking_num: taskingNum,
        worker_dispatch_count: workerDispatchCount,
        worker_num: workerNum,
        worker_request_count: workerRequestCount,
      } = result.data.data;

      this.closeCount = closeCount
      this.acceptCount = acceptCount
      this.connectionNum = connectionNum
      this.coroutineNum = coroutineNum
      this.dispatchCount = dispatchCount
      this.idleWorkerNum = idleWorkerNum
      this.requestCount = requestCount
      this.startTime = startTime
      this.taskWorkerNum = taskWorkerNum
      this.taskingNum = taskingNum
      this.workerDispatchCount = workerDispatchCount
      this.workerNum = workerNum
      this.workerRequestCount = workerRequestCount
    },
  },
};
</script>
