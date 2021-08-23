<template>
    <div>
        <el-row>
            <el-tag v-for="extension in extensions" :key="extension">
                {{ extension }}
            </el-tag>
        </el-row>
    </div>
</template>

<script>
import { getLoadedExtensions } from '@/api/extensions'

export default {
  data() {
    return {
      runs: -1,
      collected: -1,
      threshold: -1,
      roots: -1,
      extensions: []
    }
  },
  created() {
    this.getLoadedExtensions()
  },
  methods: {
    async getLoadedExtensions() {
      const { data } = await getLoadedExtensions()

      this.extensions = data
    }
  }
}
</script>

<style>
.el-tag {
    margin-top: 10px;
    margin-left: 10px;
}

.el-row {
    margin-bottom: 20px;
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    min-height: 36px;
    border-radius: 4px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
