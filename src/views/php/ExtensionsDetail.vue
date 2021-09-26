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
import ExtensionInfo from '@/views/php/components/ExtensionInfo.vue'

@Component({
  name: 'Tab',
  components: {
    TabPane: ExtensionInfo
  }
})

export default class extends Vue {
  private tabMapOptions = [
    {
      label: 'Classes',
      key: 'classes'
    },
    {
      label: 'Versions',
      key: 'version'
    },
    {
      label: 'Constants',
      key: 'constants'
    },
    {
      label: 'IniEntries',
      key: 'iniEntries'
    },
    {
      label: 'Dependencies',
      key: 'dependencies'
    },
    {
      label: 'Functions',
      key: 'functions'
    },
    {
      label: 'Info',
      key: 'info'
    }
  ]

  private activeName = 'classes'
  private extension_name = ''

  @Watch('activeName')
  private onActiveNameChange(value: string) {
    this.$router.push(`${this.$route.path}?extension_name=${this.extension_name}&tab=${value}`).catch(err => {
      console.warn(err)
    })
  }

  created() {
    const extension_name = this.$route.query.extension_name as string
    this.extension_name = extension_name
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
