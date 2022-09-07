<template>
  <div id="body">
    <div class="sub-main-w3">
      <form action="#" method="post">
        <h1>Brog</h1>
        <h2 class="form__title">------------</h2>
        <h2 class="form__title1">Think-outside-the-box</h2>
        <div class="form-style-agile">
          <input v-model="registerCredential.email" placeholder="Email" required="" type="text"/>
        </div>
        <div class="form-style-agile">
          <input v-model="registerCredential.username" placeholder="Username" required="" type="text"/>
        </div>
        <div class="form-style-agile">
          <input v-model="registerCredential.password" placeholder="Password" required="" type="password"/>
        </div>
        <div class="form-style-agile">
          <input v-model="registerCredential.passwordCheck" placeholder="Confirm Password" required="" type="password"/>
        </div>
        <div class="form-style-agile">
          <input v-model="registerCredential.captcha" name="Captcha" placeholder="Captcha" required="" type="text"/>
          <button @click.prevent="sendVerifyEmail">发送验证码</button>
        </div>

        <div class="wrapper">
          <div class="forms-gds">
            <button class="btn" name="login" type="submit" @click.prevent="jumpToLogin">登录</button>
            <button class="btn" name="register" type="submit" @click.prevent="onRegister">注册</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {inject, reactive} from 'vue';
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'

export default {
  name: 'register',
  setup() {
    const axios = inject('axios');
    const router = useRouter();
    const registerCredential = reactive({
      username: "",
      email: "",
      captcha: "",
      password: "",
      passwordCheck: ""
    });

    /** “发送验证邮件”按钮Click事件处理函数 */
    function sendVerifyEmail() {
      let body = {email: registerCredential.email}
      axios.post('/auth/gen_captcha', body).then((res) => {
        let res_body = res.data;
        if (res_body.status === 1) {
          ElMessage.success('邮箱验证码发送成功！')
        } else {
          console.log(res_body);
          ElMessage.error('邮箱验证码发送失败！')
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    /** “注册”按钮Click事件处理函数 */
    function onRegister() {
      let req_body = {
        'username': registerCredential.username,
        'email': registerCredential.email,
        'password': registerCredential.password,
        'captcha': registerCredential.captcha
      };

      axios.post('/auth/register', req_body).then((res) => {
        let resBody = res.data;
        if (resBody.status === 1) {
          router.push('/login');
        } else {
          if (resBody.status === 2) {
            ElMessage.error('注册失败！用户名已存在！');
          } else if (resBody.status === 3) {
            ElMessage.error('注册失败！邮箱验证码错误！');
          } else if (resBody.msg === 'idCrashTooManyTimes') {
            ElMessage.error('注册失败！用户创建失败！');
          } else {
            ElMessage.error('注册失败！')
          }
        }
      }).catch((error) => {
        console.log(error);
      })
    }

    const jumpToLogin = function () {
      window.location.href = '/login'
    }
    return {
      registerCredential,
      jumpToLogin,
      sendVerifyEmail,
      onRegister,
    }
  },
}
</script>

<style scoped>
@import "Register.css";
</style>