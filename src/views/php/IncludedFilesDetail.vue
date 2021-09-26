<template>
  <div className="swoole-editor" class="app-container">
    <textarea ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/clike/clike.js'
import { getIncludedFilesContent } from '@/api/phpinfos'

export default {
  name: 'SwooleEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      swooleEditor: false
    }
  },
  mounted() {
    this.swooleEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/x-httpd-php',
      theme: 'monokai',
      matchBrackets: true,
      indentUnit: 4,
      indentWithTabs: true,
      readOnly: 'nocursor'
    })
    this.swooleEditor.setSize('auto', 'auto')
  },
  created() {
    this.getIncludedFilesContent()
  },
  methods: {
    async getIncludedFilesContent() {
      this.listLoading = true
      const { file_name } = this.$route.query
      const { data } = await getIncludedFilesContent(file_name)
      this.swooleEditor.setValue(data)
    }
  }
}
</script>
