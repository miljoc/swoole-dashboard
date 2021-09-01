<template>
  <el-row>
    <el-tag v-for="item in data" :key="item">
      {{ item }}
    </el-tag>
  </el-row>
</template>

<script>
import { getLoadedExtensions, getClasses } from '@/api/phpinfos'
export default {
  data() {
    return {
      data: []
    }
  },
  props: {
    type: {
      type: String,
      default: 'extensions'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      let data
      switch (this.type) {
        case 'extensions':
          data = await getLoadedExtensions()
          break
        case 'classes':
          data = await getClasses()
          break
      }

      if (data.code === 0) {
        this.data = data.data
      }
    }
  }
}
</script>
