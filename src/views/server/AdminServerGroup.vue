<template>
  <div></div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Pagination from '@/components/Pagination/index.vue'
import Vue from 'vue'

@Component({
  name: 'ServerGroup',
  components: {
    Pagination
  }
})
export default class extends Vue {

}
</script>

<style scoped>

</style>
