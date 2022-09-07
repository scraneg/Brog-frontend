<template>
  <div id="body">
    <div class="sub-main-w3">
      <form action="#" method="post">
        <h1>Brog</h1>
        <h2 class="form__title">------------</h2>
        <h2 class="form__title1">Think-outside-the-box</h2>
        <div class="form-style-agile">
          <input v-model="loginCredential.username" placeholder="Username" required="" type="text"/>
        </div>
        <div class="form-style-agile">
          <input v-model="loginCredential.password" placeholder="Password" required="" type="password"/>
        </div>
        <div class="wrapper">
          <div class="forms-gds">
            <button type="submit" @click.prevent="onLogin">登录</button>
            <button type="submit" @click.prevent="$router.push('/register')">注册</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {inject, reactive, onMounted} from "vue";
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';

export default {
  name: "login",
  setup() {
    const axios = inject("axios");
    const router = useRouter();
    axios.withCredentials = true;

    const loginCredential = reactive({
      username: "",
      password: "",
      rememberMe: false
    });

    onMounted(() => {
      let username_local = localStorage.getItem('username');
      let password_local = localStorage.getItem('password');
      if(username_local){
        loginCredential.username = username_local;
      }
      if(password_local){
        loginCredential.password = password_local;
      }
    });

    /** “登陆系统”按钮Click事件处理函数 */
    function onLogin() {
      let reqBody = {'account': loginCredential.username, 'password': loginCredential.password};

      axios.post('/auth/login', reqBody).then((res) => {
        let resBody = res.data;
        if (resBody.status === 1) {
          localStorage.setItem('name', loginCredential.username);
          if(loginCredential.rememberMe){
            localStorage.setItem('username', loginCredential.username);
            localStorage.setItem('password', loginCredential.password);
          }
          router.push('/');
        } else {
          ElMessage.error('登录失败！')
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    return {
      loginCredential,
      onLogin,
    };
  },
};
</script>

<style scoped>
@import "Login.css";
</style>