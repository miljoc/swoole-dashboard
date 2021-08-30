<template>
  <div class="app-container">
    <el-table
    :data="tableData"
    border
    stripe
    style="width: 100%"
    >
    <el-table-column
      label="名称">
      <template slot-scope="scope" >
        <span style="text-align: right;">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="value"
      label="对应值">
    </el-table-column>
  </el-table>
</div>

</template>

<script>
import { getServerStats } from '@/api/server'

export default {
  data() {
    return {
      tableData: [],
      closeCount: -1,
      acceptCount: -1,
      // connectionNum: -1,
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
      const { data } = await getServerStats()

      const {
        close_count: closeCount,
        accept_count: acceptCount,
        // connection_num: connectionNum,
        coroutine_num: coroutineNum,
        dispatch_count: dispatchCount,
        idle_worker_num: idleWorkerNum,
        request_count: requestCount,
        start_time: startTime,
        task_worker_num: taskWorkerNum,
        tasking_num: taskingNum,
        worker_dispatch_count: workerDispatchCount,
        worker_num: workerNum,
        worker_request_count: workerRequestCount
      } = data

      let time = ''

      if (startTime != null) {
        const dt = new Date(startTime * 1000)
        const yyyy = dt.getFullYear()
        const MM = (dt.getMonth() + 1).toString().padStart(2, '0')
        const dd = dt.getDate().toString().padStart(2, '0')
        const h = dt.getHours().toString().padStart(2, '0')
        const m = dt.getMinutes().toString().padStart(2, '0')
        const s = dt.getSeconds().toString().padStart(2, '0')
        time = yyyy + '-' + MM + '-' + dd + ' ' + h + ':' + m + ':' + s
      }

      this.tableData = [{
        name: '关闭连接数量',
        value: closeCount
      }, {
        name: '接收连接数量',
        value: acceptCount
      }, {
        name: '协程数',
        value: coroutineNum
      }, {
        name: 'dispatch数量',
        value: dispatchCount
      }, {
        name: '空闲进程数量',
        value: idleWorkerNum
      }, {
        name: '请求数量',
        value: requestCount
      }, {
        name: '服务器启动时间',
        value: time
      }, {
        name: 'taskWorker进程数量',
        value: taskWorkerNum
      }, {
        name: 'taskingNum数量',
        value: taskingNum
      }, {
        name: 'worker进程dispatch数量',
        value: workerDispatchCount
      }, {
        name: 'worker进程数量',
        value: workerNum
      }, {
        name: 'worker进程请求数量',
        value: workerRequestCount
      }]
    }
  }
}
</script>
