<template>
  <div class="tab-container">
    <el-tabs
        v-model="activeName"
        style="margin-top:15px"
        type="border-card"
    >
      <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
      >
        <keep-alive>
          <tab-pane
              v-if="activeName === item.key"
              :type="item.key"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import TabPane from '@/views/swoole/components/TabPane.vue'
import { getServerSetting, getServerStats } from '@/api/server'
import { IServerSetting } from '@/api/types'

@Component({
  name: 'Tab',
  components: {
    TabPane: TabPane
  }
})

export default class extends Vue {
  private tabMapOptions = [
    {
      label: 'Master',
      key: 'master'
    },
    {
      label: 'Manager',
      key: 'manager'
    },
    {
      label: 'Worker',
      key: 'worker'
    },
    {
      label: 'TaskWorker',
      key: 'task_worker'
    }
  ]

  private activeName = 'master'
  private serverStats = {}
  private serverSetting: IServerSetting = {
    mode: 0,
    reactor_num: 0,
    manager_pid: 0,
    task_worker_num: 0,
    worker_num: 0,
    master_pid: 0
  }

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    this.$router.push(`${this.$route.path}?tab=${value}`).catch(err => {
      console.warn(err)
    })
  }

  private async getServerStats() {
    const { data } = await getServerStats()

    this.serverStats = data
  }

  private async getServerSetting() {
    const { data } = await getServerSetting()

    this.serverSetting = data

    if (this.serverSetting.task_worker_num === 0) {
      this.tabMapOptions = this.tabMapOptions.filter(item => item.key !== 'task_worker')
    }

    if (this.serverSetting.mode === 1) {
      this.tabMapOptions = this.tabMapOptions.filter(item => item.key !== 'master')
      if (this.activeName === 'master') {
        this.activeName = 'worker'
      }
    }

    const serverSetting = this.serverSetting

    this.tabMapOptions.forEach(function(item: any) {
      if (item.key === 'task_worker') {
        item.label = 'TaskWorker (' + serverSetting.task_worker_num + ')'
      } else if (item.key === 'worker') {
        item.label = 'Worker (' + serverSetting.worker_num + ')'
      }
    })
  }

  created() {
    this.getServerStats()
    this.getServerSetting()
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeName = tab
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-container {
  margin: 30px;
}
</style>
