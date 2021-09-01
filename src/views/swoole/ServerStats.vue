<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Server Stats</span>
        </div>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
            <el-descriptions-item label="关闭连接数量">{{
                serverStats.close_count
              }}
            </el-descriptions-item>
            <el-descriptions-item label="接收连接数量">{{
                serverStats.accept_count
              }}
            </el-descriptions-item>
            <el-descriptions-item label="协程数">{{
                serverStats.coroutine_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="dispatch数量">{{
                serverStats.dispatch_count
              }}
            </el-descriptions-item>
            <el-descriptions-item label="空闲进程数量">{{
                serverStats.idle_worker_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="请求数量">{{
                serverStats.request_count
              }}
            </el-descriptions-item>
            <el-descriptions-item label="服务器启动时间">{{
                serverStats.start_time
              }}
            </el-descriptions-item>
            <el-descriptions-item label="TaskWorker 进程数量">{{
                serverStats.task_worker_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="TaskingNum 数量">{{
                serverStats.tasking_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Worker 进程dispatch数量">{{
                serverStats.worker_dispatch_count
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Worker 进程数量">{{
                serverStats.worker_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Worker 进程请求数量">{{
                serverStats.worker_request_count
              }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-row>
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
    console.log(this.serverStats)
  },
  methods: {
    async getServerStats() {
      const { data } = await getServerStats()
      this.serverStats = data
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin colorBtn($color) {
  background: $color;
  &:hover {
    color: $color;

    &:before,
    &:after {
      background: $color;
    }
  }
}

.blue-btn {
  @include colorBtn($blue)
}

.light-blue-btn {
  @include colorBtn($light-blue)
}

.red-btn {
  @include colorBtn($red)
}

.pink-btn {
  @include colorBtn($pink)
}

.green-btn {
  @include colorBtn($green)
}

.tiffany-btn {
  @include colorBtn($tiffany)
}

.yellow-btn {
  @include colorBtn($yellow)
}

.pan-btn {
  font-size: 14px;
  color: #fff;
  padding: 14px 36px;
  border-radius: 8px;
  border: none;
  outline: none;
  transition: 600ms ease all;
  position: relative;
  display: inline-block;

  &:hover {
    background: #fff;

    &:before,
    &:after {
      width: 100%;
      transition: 600ms ease all;
    }
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 2px;
    width: 0;
    transition: 400ms ease all;
  }

  &::after {
    right: inherit;
    top: inherit;
    left: 0;
    bottom: 0;
  }
}

.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}

.component-item {
  min-height: 100px;
}
</style>
