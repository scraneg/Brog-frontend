<template>
  <div class="community">
    <el-row justify="space-between">
      <el-col :span="16">
        <el-input :prefix-icon="Search" v-model="searchContent" placeholder="在社区中搜索"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button round type="primary" @click="uploadDialogVisible = true">上传资源👆</el-button>
      </el-col>
    </el-row>

    <el-dialog v-model="uploadDialogVisible" title="上传资源">
      <el-upload ref="uploadFile" action="http://localhost:8000/file/upload" name="f" :with-credentials="true" :auto-upload="false">
        <el-button type="primary">添加文件</el-button>
      </el-upload>
      <!--
      <el-upload ref="uploadCover" action="http://localhost:8000/file/upload" name="f" :with-credentials="true" :auto-upload="false">
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
import {onMounted, ref} from "vue";
import {Search} from "@element-plus/icons-vue";
//import {UploadInstance} from "element-plus";

export default {
  name: "community",
  setup() {
    const searchContent = ref("");
    const uploadDialogVisible = ref(false);
    const uploadFile = ref();
    const uploadCover = ref();

    onMounted(() => {
      document.title = "社区"
    })

    function uploadResource(){
      if(uploadFile.value != undefined){
        uploadFile.value.submit();
      }
      if(uploadCover.value != undefined){
        uploadCover.value.submit();
      }
    }

    return {
      searchContent,
      uploadDialogVisible,
      Search,
      uploadFile,
      uploadCover,
      uploadResource
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