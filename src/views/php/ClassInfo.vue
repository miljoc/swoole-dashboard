<template>
  <div class="app-container" id="ClassInfo">
    <div>
      <el-alert
        :closable="false"
        style="display:inline-block; vertical-align:middle; color: #909399;margin-bottom: 15px;"
        :title="class_name"
        type="default"
        effect="dark"
      />

      <el-tabs
        type="border-card"
        :value="tabs_active"
      >
        <el-tab-pane label="Constants" name="Constants">
          <el-descriptions
            border
            :column=1
          >
            <el-descriptions-item :label="item.name" v-for="(item, index) in constants_info" :key="index">
              <el-link type="primary" v-if="item.type === 'array'" @click="showArray(index)">Detail</el-link>
              <span v-else>{{ item.value }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <el-tab-pane label="Properties" name="Properties">
          <el-collapse v-model="collapse_active">
            <el-collapse-item title="Static Properties" name="1">
              <el-descriptions
                border
                :column=1
              >
                <el-descriptions-item :label="item.name" v-for="(item, index) in constants_info" :key="index">
                  <el-link type="primary" v-if="item.type === 'array'" @click="showArray(index)">Detail</el-link>
                  <span v-else>{{ item.value }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </el-collapse-item>
            <el-collapse-item title="Properties" name="2">
              <el-descriptions
                border
                :column=1
              >
                <el-descriptions-item :label="item.name" v-for="(item, index) in constants_info" :key="index">
                  <el-link type="primary" v-if="item.type === 'array'" @click="showArray(index)">Detail</el-link>
                  <span v-else>{{ item.value }}</span>
                </el-descriptions-item>
              </el-descriptions>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="Methods" name="Methods">Methods</el-tab-pane>
        <el-tab-pane label="ParentClass" name="ParentClass">ParentClass</el-tab-pane>
        <el-tab-pane label="Interface" name="Interface">Interface</el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-dialog :title="constants_name" :visible.sync="dialogTableVisible">
        <textarea ref="textarea" v-show="false"></textarea>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/javascript/javascript.js'
import { getClassesInfo } from '@/api/phpinfos'

export default {
  name: "ClassInfo",
  data() {
    return {
      tabs_active: 'Properties',
      class_name: '',

      constants_name: '',
      constants_info: {},

      collapse_active: ['1', '2'],

      dialogTableVisible: false,
      code: '',
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 4,
        // 主题，对应主题库 JS 需要提前引入
        theme: 'monokai',
        // 显示行号
        lineNumbers: true,
        line: true,
        // 是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        readOnly: true,
        // 默认的语法类型
        mode: 'javascript'
      }
    }
  },
  created() {
    this.class_name = this.$route.query.class_name
    this.getData(this.class_name)
  },
  methods: {
    /**
     * 初始化代码显示框
     */
    initCode() {
      if (this.coder === null) {
        this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      }
      this.coder.setValue(this.code)
    },
    async getData(class_name) {
      const data = await getClassesInfo(class_name)
      this.constants_info = data.data.constants
    },
    showArray(index) {
      this.dialogTableVisible = true
      // console.log(this.constants_info[index].value)
      this.constants_name = this.constants_info[index].name
      this.code = this.constants_info[index].value
      this.$nextTick(function() {
        this.initCode()
      })
    }
  }
}
</script>

<style lang="scss">

#ClassInfo{
  .el-descriptions-item__label.is-bordered-label {
    width: 50%;
  }
  .CodeMirror {
    border: 1px solid #eee;
    height: 100%;
  }
  .CodeMirror-scroll {
    //height: auto;
    overflow-y: auto;
    overflow-x: auto;
  }
  .el-dialog__body {
    padding: 5px 20px;
    height: 60vh;
  }
  .el-alert {
    padding: 0;
  }
  .el-alert__content {
    padding: 0;
  }
  .el-alert__title {
    font-size: 18px;
  }
  .el-collapse {
    border-top: 0px;
    border-bottom: 0px;
  }
  .el-collapse-item__header {
    font-size: 18px;
    font-weight: bold;
    color: #909399;
    border: 0px;
    &:hover {
      color: #46a6ff;
    }
  }
  .el-collapse-item__wrap {
    border-bottom: 0px;
  }
}

</style>
