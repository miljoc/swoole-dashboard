
<template>
  <div class="customzie">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="进程序号" align="center" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="进程id" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.processID }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 0,
          processID: 1000,
        },
        {
          id: 1,
          processID: 1001,
        },
        {
          id: 2,
          processID: 1002,
        },
        {
          id: 3,
          processID: 1003,
        },
        {
          id: 4,
          processID: 1004,
        },
        {
          id: 5,
          processID: 1005,
        },
        {
          id: 6,
          processID: 1006,
        },
        {
          id: 7,
          processID: 1007,
        },
        {
          id: 8,
          processID: 1008,
        },
        {
          id: 9,
          processID: 1009,
        },
        {
          id: 10,
          processID: 1010,
        },
        {
          id: 11,
          processID: 1011,
        },
        {
          id: 12,
          processID: 1012,
        },
        {
          id: 13,
          processID: 1013,
        },
        {
          id: 14,
          processID: 1014,
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    handleEdit(index, row) {
      this.$router.push({ path: `/worker/${row.id}` });
    },
  },
};
</script>
<style lang='scss' scoped>
.customzie {
  // @import '@/assets/style/table.scss';

  width: 100%;
  height: vh(950);
}
</style>
