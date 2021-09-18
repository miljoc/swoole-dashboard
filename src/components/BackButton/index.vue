<template>
    <el-button type="default" style="color:#909399;margin: 0 10px 10px 0;" @click="back">
      <svg-icon name="back" />
    </el-button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'BackButton'
})
export default class extends Vue {
  private back() {
    this.$router.go(-1) // 返回上一层
  }
}
</script>

<style lang="scss" scoped>

</style>
