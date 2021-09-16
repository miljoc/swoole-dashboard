<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Master Stats</span>
        </div>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
            <el-descriptions-item label="Started Time">{{
                serverStats.start_time | parseTime
              }}
            </el-descriptions-item>

            <el-descriptions-item label="Accept Count">{{
                serverStats.accept_count
              }}
            </el-descriptions-item>

            <el-descriptions-item label="Close Count">{{
                serverStats.close_count
              }}
            </el-descriptions-item>

            <el-descriptions-item label="Dispatch Count">{{
                serverStats.dispatch_count
              }}
            </el-descriptions-item>

            <el-descriptions-item label="Idle Worker Num">{{
                serverStats.idle_worker_num
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Request Count">{{
                serverStats.request_count
              }}
            </el-descriptions-item>


            <el-descriptions-item label="Worker Num">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/processes?tab=worker`}"> {{ serverStats.worker_num }}
                </router-link>
              </el-link>
            </el-descriptions-item>

            <el-descriptions-item label="TaskWorker Num">
              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/processes?tab=task_worker`}"> {{ serverStats.task_worker_num }}
                </router-link>
              </el-link>
            </el-descriptions-item>

            <el-descriptions-item label="Tasking Num"> {{ serverStats.tasking_num }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-row>

    <el-row>
      <el-card class="box-card" style="margin-top: 20px">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Worker Stats</span>
        </div>

        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
          </el-descriptions>
        </div>
        <el-table
            :data="workerStats"
            border
            fit
            highlight-current-row
            width="100%"
        >
          <el-table-column
              align="center"
              label="Worker ID"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_id }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Dispatch Count"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_request_count }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Request Count"
          >
            <template slot-scope="{row}">
              <span>{{ row.worker_dispatch_count }}</span>
            </template>
          </el-table-column>

          <el-table-column
              align="center"
              label="Coroutine Num"
          >
            <template slot-scope="{row}">

              <el-link type="primary">
                <router-link class="link-type"
                             :to="{path: `/coroutines/worker-${row.worker_id}`}">{{ row.coroutine_num }}
                </router-link>
              </el-link>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import { getServerStats } from '@/api/server'
import { parseTime, bytesFormat } from '@/utils'

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
      },
      workerStats: []
    }
  },
  filters: {
    parseTime: parseTime,
    bytesFormat: bytesFormat
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const { data } = await getServerStats()
      this.serverStats = data
      this.workerStats.push({
        worker_id: 0,
        worker_request_count: data.worker_request_count,
        worker_dispatch_count: data.worker_dispatch_count,
        coroutine_num: data.coroutine_num
      })

      for (let i = 1; i < this.serverStats.worker_num; i++) {
        const { data } = await getServerStats('worker-' + i)
        this.workerStats.push({
          worker_id: i,
          worker_request_count: data.worker_request_count,
          worker_dispatch_count: data.worker_dispatch_count,
          coroutine_num: data.coroutine_num
        })
      }

      console.dir(this.serverStats)
      console.dir(this.workerStats)
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
