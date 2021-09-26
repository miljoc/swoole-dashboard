<template>
    <div class="app-container">
        <el-row>
            <el-descriptions class="margin-top" border>
                <el-descriptions-item label="runs">{{ runs | amountRule}}</el-descriptions-item>
                <el-descriptions-item label="collected">{{
                    collected | amountRule
                }}</el-descriptions-item>
                <el-descriptions-item label="threshold">{{
                    threshold | amountRule
                }}</el-descriptions-item>
                <el-descriptions-item label="roots">{{ roots | amountRule}}</el-descriptions-item>
            </el-descriptions>
        </el-row>
    </div>
</template>

<script>
import { getGCStatus } from '@/api/phpinfos'
import { amountRule } from '@/utils'

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
  filters: {
    amountRule: amountRule
  },
  created() {
    this.getGCStatus()
  },
  methods: {
    async getGCStatus() {
      const { data } = await getGCStatus()

      const {
        runs, collected, threshold, roots
      } = data

      this.runs = runs
      this.collected = collected
      this.threshold = threshold
      this.roots = roots
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
    margin-bottom: 10px;
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
