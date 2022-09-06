<template>
  <div class="bookshelf">
    <el-row :gutter="40">
      <el-col v-for="(book,index) in books" :key="index" :span="8">
        <el-card shadow="hover" style="cursor: pointer" @click="$router.push({path: `/reader`, query: {id: book.id}})">
          <el-image :src="book.cover" alt="pic">
            <template #error>
                <el-image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.3png.com%2Fa1dc0b562b088c4101804105c5a1e019f44b.png&refer=http%3A%2F%2Fimg2.3png.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652170214&t=41ae3c3127398d49b03cd6456ed71e42" />
              </template>
          </el-image>
          <el-row justify="center">
            <h3>{{ book.name }}</h3>
          </el-row>
        </el-card>
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
      axios.get('/property/get_property').then((res) => {
        let res_body = res.data;
        if (res_body.status === 1) {
          let res_books = res_body.materials;
          res_books.forEach(res_book => {
            books.push({
              id: res_book.id,
              page: res_book.page,
              name: res_book.title,
              cover: 'https://localhost:8200/file/cover' + res_book.cover_path
            });
          });
        } else {
          console.log(res_body);
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