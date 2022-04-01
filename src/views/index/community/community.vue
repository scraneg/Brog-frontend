<template>
  <div class="community">
    <el-row justify="space-between">
      <el-col :span="16">
        <el-input v-model="searchContent" placeholder="在社区中搜索"></el-input>
      </el-col>
      <el-col :span="4">
        <el-upload>
          <el-button round type="primary">上传资源👆</el-button>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {onMounted, ref} from "vue";

export default {
  name: "community",
  setup() {
    onMounted(() => {
      document.title = "社区"
    })
    return {
      searchContent: ref("")
    }
  }
}
</script>

<style scoped>
.community {
  height: 100%;
  width: 100%;
}
</style>