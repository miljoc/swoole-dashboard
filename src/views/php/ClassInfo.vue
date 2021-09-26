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
          <el-table
            :data="constants"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column label="Name">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="value">
              <template slot-scope="scope">
                <el-link style="margin-left: 10px" type="primary" v-if="scope.row.type === 'array'" @click="showArray(scope.row)">Detail</el-link>
                <span style="margin-left: 10px" v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="Properties" name="Properties">
          <el-collapse v-model="collapse_active">
            <el-collapse-item title="Static Properties" name="1">
              <el-table
                :data="staticProperties"
                :show-header="false"
                style="width: 100%"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="Properties" name="2">
              <el-table
                :data="properties"
                :show-header="false"
                style="width: 100%"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane label="Methods" name="Methods">
          <el-collapse v-model="collapse_active">
            <el-collapse-item title="Static Methods" name="1">
              <el-table
                :data="staticMethods"
                :show-header="false"
                style="width: 100%"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
            <el-collapse-item title="Methods" name="2">
              <el-table
                :data="methods"
                :show-header="false"
                style="width: 100%"
              >
                <el-table-column label="Name">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane label="ParentClass" name="ParentClass">
          <el-table
            :data="parentClass"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column label="Name">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="Interface" name="Interface">
          <el-table
            :data="interface"
            :show-header="false"
            style="width: 100%"
          >
            <el-table-column label="Name">
              <template slot-scope="scope">
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-dialog :title="dialogTableTitle" :visible.sync="dialogTableVisible">
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
      tabs_active: 'Constants',
      class_name: '',

      constants: [],
      staticProperties: [],
      properties: [],
      staticMethods: [],
      methods: [],
      parentClass: [],
      interface: [],

      collapse_active: ['1', '2'],
      dialogTableTitle: '',
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
      this.constants = data.data.constants

      let index1 = 0
      const tmpStaticProperties = []
      for (const item of data.data.staticProperties) {
        tmpStaticProperties.push({ name: data.data.staticProperties[index1].name })
        index1++
      }
      this.staticProperties = tmpStaticProperties

      let index2 = 0
      const tmpProperties = []
      for (const item of data.data.properties) {
        tmpProperties.push({ name: data.data.properties[index2].name })
        index2++
      }
      this.properties = tmpProperties

      let index3 = 0
      const tmpStaticMethods = []
      for (const item of data.data.staticMethods) {
        tmpStaticMethods.push({ name: data.data.staticMethods[index3].name })
        index3++
      }
      this.staticMethods = tmpStaticMethods

      let index4 = 0
      const tmpMethods = []
      for (const item of data.data.methods) {
        tmpProperties.push({ name: data.data.methods[index4].name })
        index4++
      }
      this.methods = tmpMethods

      const tmpParentClass = []
      if (data.data.parentClass.length > 0) {
        tmpParentClass.push({ name: data.data.parentClass })
      }
      this.parentClass = tmpParentClass

      let index5 = 0
      const tmpInterface = []
      for (const item of data.data.interface) {
        tmpInterface.push({ name: data.data.interface[index5] })
        index5++
      }
      this.interface = tmpInterface
    },
    showArray(row) {
      this.dialogTableVisible = true
      // console.log(this.constants[index].value)
      this.dialogTableTitle = row.name
      this.code = row.value
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
