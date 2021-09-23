<template>
  <div class="app-container">
<!--    <el-card class="box-card">-->
<!--      <div-->
<!--        slot="header"-->
<!--        class="clearfix"-->
<!--      >-->
<!--        <span>Class Info</span>-->
<!--      </div>-->
      <div id="ClassInfo">
        <el-alert
          :closable="false"
          style="display:inline-block; vertical-align:middle; color: #97a8be;margin-bottom: 15px;"
          :title="class_name"
          type="default"
          effect="dark"
        />

        <el-tabs type="border-card">
          <el-tab-pane label="Constants">
            <el-descriptions
              border
              :column=1
            >
              <el-descriptions-item label="name">value</el-descriptions-item>
              <el-descriptions-item :label="item.name" v-for="(item, index) in constants_info" :key="index">{{ item.type === 'array' ? 'Array' : item.value }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="Properties">Properties</el-tab-pane>
          <el-tab-pane label="Methods">Methods</el-tab-pane>
          <el-tab-pane label="attribute">attribute</el-tab-pane>
          <el-tab-pane label="function">function</el-tab-pane>
        </el-tabs>
      </div>
<!--    </el-card>-->
  </div>
</template>

<script>
import { getClassesInfo } from '@/api/phpinfos'

export default {
  name: "ClassInfo",
  data() {
    return {
      class_name: '',
      constants_info: {}
    }
  },
  created() {
    this.class_name = this.$route.query.class_name
    console.log(this.class_name)
    this.getData(this.class_name)
  },
  methods: {
    async getData(class_name) {
      const data = await getClassesInfo(class_name)
      this.constants_info = data.data.constants
      console.log(data.data.constants)
      console.log(this.constants_info)
    }
  }
}
</script>

<style lang="scss">

#ClassInfo{
  .el-alert {
    padding: 0;
  }
  .el-alert__content {
    padding: 0;
  }
  .el-alert__title {
    font-size: 18px;
  }
}

</style>
