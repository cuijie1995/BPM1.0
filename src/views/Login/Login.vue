<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="off"
      label-position="left"
    >
      <el-form-item prop="userNameOrEmailAddress">
        <span class="svg-container">
          <i class="iconfont icon-muser1" />
        </span>
        <el-input
          ref="userNameOrEmailAddress"
          v-model="loginForm.userNameOrEmailAddress"
          placeholder="请输入账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="off"
        />
      </el-form-item>

      <el-tooltip content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="iconfont icon-mima" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="off"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i
              :class="passwordType === 'password' ? 'iconfont icon-yanjing' : 'iconfont icon-yanjing1'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>
<script>
import $ from "jquery";
import axios from "axios";
import { login } from "../../api/login";
let self;
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        userNameOrEmailAddress: "",
        password: ""
      },
      loginRules: {
        userNameOrEmailAddress: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      isLogin: false,
      passwordType: "password",
      loading: false
    };
  },
  mounted() {
    self = this;
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          login(this.loginForm)
            .then(res => {
              localStorage.setItem("userName", res.result.userName);
              localStorage.setItem("Token", res.result.accessToken);
              localStorage.setItem("userId", res.result.userId);
              this.$router.push("/");
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("用户不存在，不能登录");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__inner {
      color: #ffffff;
    }

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }

  .el-form-item {
    color: #454545;
    border-bottom: 1px solid #ffffff;
  }
}
</style>

<style lang="scss" scoped>
i {
  color: #ffffff;
  font-size: 14px;
}
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url(../../assets/404_images/beijing.jpg);

  .login-form {
    position: relative;
    width: 340px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding-top: 15%;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .el-button--primary {
    background: #5db75d !important;
    border-color: #5db75d !important;
  }
}
</style>
