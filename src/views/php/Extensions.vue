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
import axios from 'axios';

export default {
    data() {
        return {
            runs: -1,
            collected: -1,
            threshold: -1,
            roots: -1,
            extensions: [],
        };
    },
    created() {
        this.getLoadedExtensions();
    },
    methods: {
        async getLoadedExtensions() {
            const { id } = this.$route.params;
            const result = await axios.get(
                `http://127.0.0.1:9999/api/get_loaded_extensions/worker-${id}`,
            );

            const { code } = result.data;

            if (code !== 0) {
                this.$message({
                    showClose: true,
                    message: result.data.data,
                    type: 'error',
                });
                return;
            }

            this.extensions = result.data.data;
        }
    },
};
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
