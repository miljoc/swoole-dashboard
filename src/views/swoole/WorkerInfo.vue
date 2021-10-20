<template>
  <div class="app-container">
    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Worker Detail</span>
        </div>
        <el-divider content-position="left">Worker Status</el-divider>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
              :column=2
              :labelStyle="{
                 'width': '10%'
              }"
              :contentStyle="{
                'width': '40%',
                'word-break': 'break-all'
            }"
          >
            <el-descriptions-item label="PID" v-if="!this.$route.params.id.startsWith('master')">{{
                workerInfo.pid
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Worker ID" v-if="!this.$route.params.id.startsWith('master')">{{
                workerInfo.id
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Memory Usage">{{
                workerInfo.memory_usage | bytesFormat
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Memory Real Usage">{{
                workerInfo.memory_real_usage | bytesFormat
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Coroutine Num">{{
                workerInfo.coroutine_stats.coroutine_num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Coroutine Peak Num">{{
                workerInfo.coroutine_stats.coroutine_peak_num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="AIO Task Num">{{
                workerInfo.coroutine_stats.aio_task_num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="AIO Thread Num">{{
                workerInfo.coroutine_stats.aio_worker_num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Event Num">{{
                workerInfo.coroutine_stats.event_num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Timer Num">{{
                workerInfo.timer_stats.num | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Signal Listener Num">{{
                workerInfo.coroutine_stats.signal_listener_num | amountRule
              }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider content-position="left">GC Status</el-divider>
          <el-descriptions
              class="margin-top"
              border
              :column=2
              :labelStyle="{
                 'width': '10%'
              }"
              :contentStyle="{
                'width': '40%',
                'word-break': 'break-all'
            }"
          >
            <el-descriptions-item label="runs">{{ workerInfo.gc_status.runs | amountRule }}</el-descriptions-item>
            <el-descriptions-item label="collected">{{
                workerInfo.gc_status.collected | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="threshold">{{
                workerInfo.gc_status.threshold | amountRule
              }}
            </el-descriptions-item>
            <el-descriptions-item label="roots">{{ workerInfo.gc_status.roots | amountRule }}</el-descriptions-item>
          </el-descriptions>
          <el-divider content-position="left">Process Status</el-divider>
          <el-descriptions
              border
              :labelStyle="{
                'width': '10%'
              }"
              :contentStyle="{
                'width': '40%',
                'word-break': 'break-all'
            }"
              :column=2
          >
            <el-descriptions-item v-for="(item, index) in workerInfo.process_status" :label="index" :key="index">
              {{ item }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getWorkerInfo2 } from '@/api/server'
import { amountRule, bytesFormat } from '@/utils/index'

export default {
  data() {
    return {
      workerInfo: {
        coroutine_stats: {},
        timer_stats: {}
      }
    }
  },
  filters: {
    bytesFormat: bytesFormat,
    amountRule: amountRule
  },
  created() {
    this.getWorkerInfo()
  },
  methods: {
    async getWorkerInfo() {
      const { data } = await getWorkerInfo2(this.$route.params.id)
      this.workerInfo = data
    }
  }
}
</script>
