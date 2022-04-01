<template>
  <div class="community">
    <el-input v-model="searchContent" placeholder="在社区中搜索"></el-input>
    <el-upload>
      <el-button>上传资源👆</el-button>
    </el-upload>
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