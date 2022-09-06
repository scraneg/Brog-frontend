<template>
  <div class="community">
    <el-row style="padding: 20px">
      <el-col :span="16">
        <el-input :prefix-icon="Search" v-model="searchContent" placeholder="在社区中搜索"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button round type="primary" @click="uploadDialogVisible = true">上传资源👆</el-button>
      </el-col>
    </el-row>

    <el-space direction="vertical">
      <el-card v-for="(book_item, index) in bookList" :key="book_item.bid" :name="index" shadow="hover">
        <el-row justify="space-between">
          <el-col :span="5">
            <el-image :src="book_item.cover">
              <template #error>
                <el-image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.3png.com%2Fa1dc0b562b088c4101804105c5a1e019f44b.png&refer=http%3A%2F%2Fimg2.3png.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652170214&t=41ae3c3127398d49b03cd6456ed71e42" />
              </template>
            </el-image>
          </el-col>
          <el-col :span="5">
            <h3>{{ book_item.name }}</h3>
            <p v-if="book_item.audited" style="color: green">已校对资源</p>
            <p v-if="!book_item.audited" style="color: gray">未校对资源</p>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="onAddToShelf(book_item)">添加到我的书架</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-space>

    <el-dialog v-model="uploadDialogVisible" title="上传资源">
      <el-input v-model="uploadMeta.title" placeholder="资源标题" />
      <el-upload ref="uploadFile" action="https://localhost:8200/community/upload_material" :data="uploadMeta" name="file" :with-credentials="true" :auto-upload="false">
        <el-button type="primary">添加文件</el-button>
      </el-upload>
      <!--
      <el-upload ref="uploadCover" action="https://localhost:8200/community/upload_cover" name="file" :with-credentials="true" :auto-upload="false">
        <el-button type="secondary">添加封面</el-button>
      </el-upload>
      -->
      <el-row justify="center">
        <el-button @click="uploadResource">上传</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {onMounted, ref, reactive, inject} from "vue";
import {Search} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus';

export default {
  name: "community",
  setup() {
    const axios = inject("axios");
    axios.withCredentials = true;

    const searchContent = ref("");
    const uploadDialogVisible = ref(false);
    const uploadFile = ref();
    const uploadCover = ref();
    const bookList = reactive([
      {
        bid: 0,
        name: "书",
        cover: "http://img.book118.com/sr1/M00/29/3D/wKh2AlvnQSiIR2BKABBsKNt0issAAQZFwBMTpgAEGxA391.png",
        audited: false
      }
    ]);

    const uploadMeta = reactive({
      type: 1,
      title: "1234test"
    });

    onMounted(() => {
      document.title = "社区";
      getCommunityResource();
    });

    function getCommunityResource(){
      axios.get('/community/list_material').then((res) => {
        let res_body = res.data;
        if (res_body.status === 1) {
          let res_books = res_body.materials;
          res_books.forEach(res_book => {
            bookList.push({
              bid: res_book.id,
              name: res_book.title,
              cover: 'https://localhost:8200/file/cover/' + res_book.cover_path,
              audited: res_book.audited
            });
          });
          console.log(bookList);
        } else {
          console.log(res_body);
          ElMessage.error('获取社区资源错误！')
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    function uploadResource(){
      if(uploadFile.value != undefined){
        uploadFile.value.submit();
      }
      if(uploadCover.value != undefined){
        uploadCover.value.submit();
      }
    }

    function onAddToShelf(book_item){
      //if(book_item.audited){
        let reqBody = {'mid': book_item.bid};

        axios.post('/community/add_property', reqBody).then((res) => {
          let resBody = res.data;
          if (resBody.status === 1) {
            ElMessage.success('添加到我的书架成功！');
          } else {
            console.log(resBody);
            ElMessage.error('添加到我的书架失败！');
          }
        }).catch((error) => {
          console.log(error);
        })
      //}
      //else{
      //  ElMessage.error('十分抱歉！资源尚未校对，为保证系统正确运作，暂不支持加入书架！')
      //}
    }

    return {
      searchContent,
      uploadDialogVisible,
      Search,
      uploadFile,
      uploadCover,
      uploadResource,
      bookList,
      onAddToShelf,
      uploadMeta
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