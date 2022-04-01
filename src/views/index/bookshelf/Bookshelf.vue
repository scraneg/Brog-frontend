<template>
  <div class="bookshelf">
    <el-row :gutter="40">
      <el-col v-for="(book,index) in books" :key="index" :span="8">
        <el-image :src="book.url" alt="pic" style="cursor: pointer" @click="$router.push(`/reader?id=${book.id}`)"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {onMounted, reactive} from "vue";

export default {
  name: "bookshelf",
  setup() {
    onMounted(() => {
      document.title = "我的书架"
    })
    return {
      books: reactive([{
        id: 1,
        url: 'http://img.book118.com/sr1/M00/29/3D/wKh2AlvnQSiIR2BKABBsKNt0issAAQZFwBMTpgAEGxA391.png'
      }, {
        id: 2,
        url: 'http://img3m4.ddimg.cn/39/28/1737445584-1_w_1.jpg'
      }, {
        id: 3,
        url: 'http://img.book118.com/sr1/M00/29/3D/wKh2AlvnQSiIR2BKABBsKNt0issAAQZFwBMTpgAEGxA391.png'
      }])
    }
  }
}
</script>

<style scoped>
.bookshelf {
  width: 100%;
  height: 100%;
}
</style>