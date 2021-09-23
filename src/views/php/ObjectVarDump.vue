<template>
  <div class="app-container" id="VarDump">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span>Worker Info</span>
      </div>
      <textarea ref="textarea" v-show="false"></textarea>
    </el-card>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/clike/clike.js'
// import 'codemirror/mode/javascript/javascript'
import { getObjectByHandle } from '@/api/server'

export default {
  name: 'ObjectVarDump',
  data() {
    return {
      code: '',
      // 编辑器实例
      coder: null,
      // 默认配置
      options: {
        // 缩进格式
        tabSize: 4,
        // 主题，对应主题库 JS 需要提前引入
        // theme: 'material-darker',
        // theme: 'material',
        // theme: 'dracula',
        // theme: 'idea',
        theme: 'monokai',
        // 显示行号
        lineNumbers: true,
        line: true,
        // 是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        readOnly: true,
        // 默认的语法类型
        // mode: 'application/x-httpd-php'
        mode: 'javascript'
        // mode: { name: 'php', globalVars: true }
        // mode: { name: 'javascript', globalVars: true }
      }
    }
  },
  mounted() {
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
      const object_id = this.$route.query.object_id
      const data = await getObjectByHandle(object_id)
      this.code = data.data
      this.initCode()
    }
  }
}
</script>

<style lang="scss">
#VarDump {
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
