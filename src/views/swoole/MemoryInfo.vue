<template>
  <div class="mixin-components-container">
    <el-row>
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Memory Info</span>
        </div>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
            <el-descriptions-item label="Struct Server">{{ info.server | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Struct Workers">{{ info.workers| bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Global Memory">{{ info.global_memory | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Connection List">{{ info.connection_list | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Session List">{{ info.session_list| bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Socket List">{{ info.socket_list | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Message Bus">{{ info.message_bus | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="All of Socket Out Buffer">{{ info.socket_out_buffer | bytesFormat }}
            </el-descriptions-item>
            <el-descriptions-item label="Thread Global Memory">{{ info.thread_global_memory| bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="ZendVM Memory">{{ info.php_memory }}</el-descriptions-item>
            <el-descriptions-item label="HTTP Form Data Buffer"> {{
                info.http_form_data_buffer| bytesFormat
              }}
            </el-descriptions-item>
            <el-descriptions-item label="HTTP Buffer"> {{ info.http_buffer | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="Zlib Buffer"> {{ info.zlib_buffer | bytesFormat }}</el-descriptions-item>

            <el-descriptions-item label="Total"> {{ total | bytesFormat }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-row>

    <el-row v-for="item in threadMemoryInfo" style="margin-top: 20px">
      <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
          <span>Thread #{{ item.id }}</span>
        </div>
        <div style="padding: 0; margin: 0">
          <el-descriptions
              border
          >
            <el-descriptions-item label="Message Bus">{{ item.message_bus | bytesFormat }}</el-descriptions-item>
            <el-descriptions-item label="All of Socket Out Buffer">{{ item.socket_out_buffer | bytesFormat }}
            </el-descriptions-item>
            <el-descriptions-item label="Thread Global Memory">{{
                item.thread_global_memory| bytesFormat
              }}
            </el-descriptions-item>
            <el-descriptions-item label="Total"> {{ item.total | bytesFormat }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-row>

  </div>
</template>

<script>

import { getMemoryInfo, getServerSetting } from '@/api/server'
import { parseTime, bytesFormat, socketTypeFilter } from '@/utils'

export default {
  data() {
    return {
      info: {},
      serverSetting: {},
      threadMemoryInfo: [],
      total: 0
    }
  },
  filters: {
    parseTime: parseTime,
    bytesFormat: bytesFormat,
    socketTypeFilter: socketTypeFilter
  },
  created() {
    this.getData()
  },
  methods: {
    sum(info) {
      let total = 0
      for (const key in info) {
        total += info[key]
      }
      return total
    },
    async getData() {
      do {
        const { data } = await getMemoryInfo(this.$route.params.worker)
        this.info = data
      } while (0)

      this.total = this.sum(this.info)

      do {
        const { data } = await getServerSetting()
        this.serverSetting = data
      } while (0)

      if (this.serverSetting.mode === 2 && this.$route.params.worker.substring(0, 6) === 'master') {
        for (let i = 0; i < this.serverSetting.reactor_num; i++) {
          const { data } = await getMemoryInfo('reactor-' + i)
          const thread_memory_info = {
            message_bus: data.message_bus,
            socket_out_buffer: data.socket_out_buffer,
            thread_global_memory: data.thread_global_memory
          }
          thread_memory_info.total = this.sum(thread_memory_info)
          thread_memory_info.id = i
          this.threadMemoryInfo.push(thread_memory_info)
        }

        console.dir(this.threadMemoryInfo)
      }
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
