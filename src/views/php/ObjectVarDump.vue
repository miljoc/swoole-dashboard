<template>
  <div class="app-container" id="VarDump">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/material-darker.css'
// import 'codemirror/theme/material.css'
// import 'codemirror/theme/dracula.css'
import 'codemirror/theme/idea.css'
import 'codemirror/mode/php/php'
import 'codemirror/mode/javascript/javascript'

export default {
  name: 'ObjectVarDump',
  props: {
    object_id: null
  },
  data() {
    return {
      code: "Swoole\\Server\\Port::__set_state(array(\n   'onConnect' => \n  Closure::__set_state(array(\n  )),\n   'onReceive' => \n  Closure::__set_state(array(\n  )),\n   'onClose' => \n  Closure::__set_state(array(\n  )),\n   'onPacket' => NULL,\n   'onBufferFull' => NULL,\n   'onBufferEmpty' => NULL,\n   'onRequest' => NULL,\n   'onHandShake' => NULL,\n   'onOpen' => NULL,\n   'onMessage' => NULL,\n   'onDisconnect' => NULL,\n   'host' => '0.0.0.0',\n   'port' => 9501,\n   'type' => 1,\n   'sock' => 4,\n   'setting' => \n  array (\n    'admin_server' => '0.0.0.0:9502',\n    'worker_num' => 2,\n    'task_worker_num' => 4,\n  ),\n   'connections' => \n  Swoole\\Connection\\Iterator::__set_state(array(\n  )),\n))",
      // code: "Swoole\\Connection\\Iterator::__set_state(array(\n))",
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
        theme: 'idea',
        // 显示行号
        lineNumbers: true,
        line: true,
        // 是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        readOnly: true,
        // 默认的语法类型
        mode: 'javascript'
        // mode: { name: 'php', globalVars: true }
        // mode: { name: 'javascript', globalVars: true }
      }
    }
  },
  mounted() {
    this.initCode()
  },
  methods: {
    /**
     * 初始化代码显示框
     */
    initCode() {
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.options)
      this.coder.setValue(this.code)
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
