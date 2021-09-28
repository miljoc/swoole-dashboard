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
        <el-tab-pane :label="$t('classes.constants')" name="Constants">
          <el-table
            :data="constants"
            border
            :show-header="constants.length > 0 ? true : false"
            style="width: 100%"
          >
            <el-table-column label="ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('classes.constantName')" align="center">
              <template slot-scope="scope">
                {{scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('classes.constantValue')" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" v-if="scope.row.type === 'detail'" @click="showArray(scope.row)" svg-icon="print">
                  <svg-icon name="print" /> {{ $t('common.detail') }}
                </el-button>
                <span style="margin-left: 10px" v-else>{{ scope.row.value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane :label="$t('classes.properties')" name="Properties">
          <el-collapse v-model="collapse_active">
            <el-divider content-position="left">{{ $t('classes.staticProperties') }}</el-divider>
            <el-table
              :data="staticProperties"
              border
              :show-header="staticProperties.length > 0 ? true : false"
              style="width: 100%"
            >
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.modifiers')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.modifiers }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.propertiesName')" align="center">
                <template slot-scope="scope">{{scope.row.name }}</template>
              </el-table-column>
              <el-table-column :label="$t('classes.propertiesValue')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.default }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.actions')" align="center">
                <template slot-scope="scope">
                  <el-button type="success" size="mini" @click="handleVarDump(scope.row)" svg-icon="print">
                    <svg-icon name="print" />
                    {{ $t('common.varDump') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-divider content-position="left">{{ $t('classes.properties') }}</el-divider>
            <el-table
              :data="properties"
              border
              :show-header="properties.length > 0 ? true : false"
              style="width: 100%"
            >
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.modifiers')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.modifiers }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.propertiesName')" align="center">
                <template slot-scope="scope">{{scope.row.name }}</template>
              </el-table-column>
              <el-table-column :label="$t('classes.propertiesValue')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.default }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane :label="$t('classes.methods')" name="Methods">
          <el-collapse v-model="collapse_active">
            <el-divider content-position="left">{{ $t('classes.staticMethods') }}</el-divider>
            <el-table
              :data="staticMethods"
              border
              :show-header="staticMethods.length > 0 ? true : false"
              style="width: 100%"
            >
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.modifiers')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.modifiers }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.methodName')" align="center">
                <template slot-scope="scope">{{scope.row.name }}</template>
              </el-table-column>
              <el-table-column :label="$t('common.sourceFile')" align="center" v-if="filename.length > 0">
                <template slot-scope="scope">
                  <el-link type="primary">
                    <router-link class="link-type"
                                 :to="{path: `/includedfiles_detail?file_name=${filename}&line=${scope.row.line}`}">{{ filename + ':' + scope.row.line }}
                    </router-link>
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
            <el-divider content-position="left">Methods</el-divider>
            <el-table
              :data="methods"
              border
              :show-header="methods.length > 0 ? true : false"
              style="width: 100%"
            >
              <el-table-column label="ID" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.modifiers')" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.modifiers }}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('classes.methodName')" align="center">
                <template slot-scope="scope">{{scope.row.name }}</template>
              </el-table-column>
              <el-table-column :label="$t('common.sourceFile')" align="center" v-if="filename.length > 0">
                <template slot-scope="scope">
                  <el-link type="primary">
                    <router-link class="link-type"
                                 :to="{path: `/includedfiles_detail?file_name=${filename}&line=${scope.row.line}`}">{{ filename + ':' + scope.row.line }}
                    </router-link>
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane :label="$t('classes.parentClass')" name="ParentClass">
          <el-table
            :data="parentClass"
            border
            :show-header="parentClass.length > 0 ? true : false"
            style="width: 100%"
          >
            <el-table-column label="Name" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row.name)">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane :label="$t('classes.interface')" name="Interface">
          <el-table
            :data="interface"
            border
            :show-header="interface.length > 0 ? true : false"
            style="width: 100%"
          >
            <el-table-column label="ID" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Name" align="center">
              <template slot-scope="scope">
                <el-link type="primary" @click="jump(scope.row.name)">
                  {{ scope.row.name }}
                </el-link>
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
import { getClassesInfo, getStaticPropertyValue } from '@/api/phpinfos'

export default {
  name: "ClassInfo",
  data() {
    return {
      tabs_active: 'Constants',
      class_name: '',

      filename: '',

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
    jump(class_name) {
      this.class_name = class_name
      this.getData(this.class_name)
    },
    async handleVarDump(row) {
      console.log(row)
      this.dialogTableVisible = true
      // console.log(this.constants[index].value)
      this.dialogTableTitle = row.name
      const worker = this.$route.query.worker ?? 'master'
      const data = await getStaticPropertyValue(this.class_name, row.name, worker)
      this.code = data.data.value
      this.$nextTick(function() {
        this.initCode()
      })
    },
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
      this.filename = data.data.filename
      let index = 0
      const tmpConstants = []
      for (const item of data.data.constants) {
        tmpConstants.push({
          id: index + 1,
          name: data.data.constants[index].name,
          value: data.data.constants[index].value,
          type: data.data.constants[index].type
        })
        index++
      }
      this.constants = tmpConstants

      let index1 = 0
      const tmpStaticProperties = []
      for (const item of data.data.staticProperties) {
        tmpStaticProperties.push({
          id: index1 + 1,
          name: data.data.staticProperties[index1].name,
          modifiers: data.data.staticProperties[index1].modifiers,
          default: data.data.staticProperties[index1].value
        })
        index1++
      }
      this.staticProperties = tmpStaticProperties

      let index2 = 0
      const tmpProperties = []
      for (const item of data.data.properties) {
        tmpProperties.push({
          id: index2 + 1,
          name: data.data.properties[index2].name,
          modifiers: data.data.properties[index2].modifiers,
          default: data.data.properties[index2].value
        })
        index2++
      }
      this.properties = tmpProperties

      let index3 = 0
      const tmpStaticMethods = []
      for (const item of data.data.staticMethods) {
        tmpStaticMethods.push({
          id: index3 + 1,
          name: data.data.staticMethods[index3].name,
          line: data.data.staticMethods[index3].line,
          modifiers: data.data.staticMethods[index3].modifiers
        })
        index3++
      }
      this.staticMethods = tmpStaticMethods

      let index4 = 0
      const tmpMethods = []
      for (const item of data.data.methods) {
        tmpMethods.push({
          id: index4 + 1,
          name: data.data.methods[index4].name,
          line: data.data.methods[index4].line,
          modifiers: data.data.methods[index4].modifiers
        })
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
        tmpInterface.push({ id: index5 + 1, name: data.data.interface[index5] })
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
