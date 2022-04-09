<template>
  <div class="header">
    <span class="title">Brog</span>
    <el-icon class="home-icon">
      <HomeFilled/>
    </el-icon>
  </div>
</template>

<script>
import {HomeFilled} from "@element-plus/icons-vue"

export default {
  components: {
    HomeFilled
  },
}
</script>

<style scoped>
.title {
  font-size: xx-large;
}

.home-icon {
  cursor: pointer;
  font-size: 2em;
}

.header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>