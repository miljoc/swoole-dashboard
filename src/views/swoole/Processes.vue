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
import Workers from '@/views/swoole/components/Workers.vue'
import { getServerSetting, getServerStats } from '@/api/server'

@Component({
  name: 'Tab',
  components: {
    TabPane: Workers
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
  private serverSetting = {
    mode: 1
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

    if (this.serverSetting.mode === 1) {
      this.tabMapOptions = this.tabMapOptions.filter(item => item.key !== 'master')
      if (this.activeName === 'master') {
        this.activeName = 'worker'
      }
    }
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
