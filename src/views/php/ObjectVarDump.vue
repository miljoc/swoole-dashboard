<template>
  <div class="app-container" id="VarDump">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>{{ class_name }}</span>
      </div>
      <textarea ref="textarea" v-show="false"></textarea>
    </el-card>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript.js'
import { getObjectByHandle } from '@/api/server'

export default {
  name: 'ObjectVarDump',
  data() {
    return {
      class_name: '',
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
  mounted() {
    this.class_name = this.$route.query.class
    this.getData()
  },
  methods: {
    /**
     * 初始化代码显示框
     */
    initCode() {
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      this.$nextTick(function() {
        this.coder.setValue(this.code)
      })
    },
    async getData() {
      const worker = this.$route.query.worker ?? 'master'
      const object_id = this.$route.query.object_id
      const object_hash = this.$route.query.object_hash
      const data = await getObjectByHandle(object_id, object_hash, worker)
      this.code = data.data
      this.initCode()
    }
  }
}
</script>

<style lang="scss">
#VarDump {
  .el-card__body {
    overflow-y: auto;
    overflow-x: auto;
    height: 80vh;
  }
  .CodeMirror {
    border: 1px solid #eee;
    height: auto;
  }
  .CodeMirror-scroll {
    height: auto;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>
