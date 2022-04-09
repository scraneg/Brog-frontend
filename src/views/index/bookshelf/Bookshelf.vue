<template>
  <div class="bookshelf">
    <el-row :gutter="40">
      <el-col v-for="(book,index) in books" :key="index" :span="8">
        <el-image :src="book.cover" alt="pic" style="cursor: pointer" @click="$router.push(`/reader?id=${book.id}`)"/>
        <el-row justify="center">
          <h3>{{ book.name }}</h3>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {onMounted, reactive, inject} from "vue";
import {ElMessage} from 'element-plus'

export default {
  name: "bookshelf",
  setup() {
    const axios = inject("axios");
    axios.defaults.withCredentials = true;

    const books = reactive([
      {
        id: 1,
        page: 1,
        name: "线性代数",
        cover: 'http://img.book118.com/sr1/M00/29/3D/wKh2AlvnQSiIR2BKABBsKNt0issAAQZFwBMTpgAEGxA391.png'
      }
    ]);

    onMounted(() => {
      document.title = "我的书架";
      getUserShelf();
    });

    function getUserShelf(){
      axios.get('/file/list_book', {
        param: {
          
        }
      }).then((res) => {
        let res_body = res.data;
        if (res_body.status === 'success') {
          let res_books = res_body.booklist;
          res_books.forEach(res_book => {
            books.push({
              id: res_book.bid,
              page: res_book.page,
              name: res_book.filename,
              cover: res_book.cover_path
            });
          });
        } else {
          ElMessage.error('获取用户书架错误！')
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    return {
      books
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