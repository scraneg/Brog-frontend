<template>
  <el-space direction="vertical" :size="70" class="main">
    <el-avatar :size="100" :src="avatarPath" />
    <div>{{username}}</div>
    <el-button class="button" @click.prevent="$router.push('bookshelf')">
      <el-badge value="5"/>
      我的书架
    </el-button>
    <el-button class="button" @click.prevent="$router.push('notebook')">
      <el-badge value="5"/>
      我的笔记
    </el-button>
    <el-button class="button" @click.prevent="$router.push('community')">
      <el-badge value="5"/>
      社区
    </el-button>
  </el-space>
</template>

<script>
import {onMounted, ref, inject} from "vue";
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'

export default {
  name: "aside",
  setup(){
    const axios = inject("axios");
    axios.withCredentials = true;
    const baseURL = inject("baseURL")
    const username = ref("");
    const router = useRouter();
    const avatarPath = ref("https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png");

    onMounted(() => {
      getUsername();
    });

    function getUsername(){
      axios.get('/profile/get_profile').then((res) => {
        let res_body = res.data;
        if (res_body.status === 1) {
          let profile = res_body.profile;
          username.value = profile.nickname;
          if(profile.avatar != null){
            avatarPath.value = baseURL + "/file/avatar/" + profile.avatar;
            console.log(avatarPath);
          }
        } else {
          console.log(res_body);
          router.replace("/login")
          ElMessage.error('获取用户信息错误！')
        }
      }).catch((error) => {
        router.replace("/login")
        ElMessage.error('获取用户信息错误！')
        console.log(error);
      })
    }

    return {
      username,
      avatarPath
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100%;
  color: #000;
  outline: none;
  font-size: x-large;
  letter-spacing: 1px;
  padding: 15px 15px;
  box-sizing: border-box;
  border: none;
  border-top: 1.5px solid #000000;/*增加边框*/
  border-bottom: 1.5px solid #000000;
  border-radius: 10px 10px 10px 10px;/*我们都知道border-radius后面如果是4个值的话,依次代表的是左上角、右上角、右下角、左下角。就这样使边框有弯曲*/
  background: #fff;
}
.button {
  width: 15em;
  font-size: medium;
  border-color: #1B455A;
  border-bottom: 0;
  border-top: 0;
  border-radius: 10px 10px 10px 10px;
}
</style>