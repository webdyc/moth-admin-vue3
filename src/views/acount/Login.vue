<template>
  <div class="login-container">
    <div class="top"></div>
    <div class="bottom"></div>
    <div class="center">
      <a-form
        class="login-form"
        ref="formRef"
        name="custom-validation"
        :model="dataFrom"
        :rules="dataFromRules"
        @finish="handleFinish"
      >
        <div class="title-container">
          <h3 class="title">{{ title }}</h3>
        </div>
        <a-form-item ref="username" name="username">
          <a-input
            v-model:value="dataFrom.username"
            type="text"
            size="large"
            autocomplete="off"
            @change="
              () => {
                $refs.username.onFieldChange()
              }
            "
          >
            <template #prefix>
              <svg-icon icon-name="user" class-name="login-svg" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item ref="password" name="password">
          <a-input-password
            v-model:value="dataFrom.password"
            size="large"
            autocomplete="off"
            @change="
              () => {
                $refs.password.onFieldChange()
              }
            "
          >
            <template #prefix>
              <svg-icon icon-name="password" class-name="login-svg" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item ref="code" name="code">
          <a-input-group size="large">
            <a-row :gutter="15">
              <a-col :span="14">
                <a-input
                  v-model:value="dataFrom.code"
                  type="text"
                  style="line-height: 1.5715"
                />
              </a-col>
              <a-col :span="10">
                <div class="veriCodeImg" @click="getCode">
                  <img :src="codeUrl" />
                </div>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
            size="large"
            :loading="loading"
          >
            立即登录</a-button
          >
        </a-form-item>
        <!-- 忘记密码、注册 -->
        <div class="tips">
          <span class="mr-2">用户名: admin</span>
          <span> 密码: admin123</span>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import { reactive, toRefs } from '@vue/reactivity'
import defaultSettings from '@/settings.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { sendCode } from '@/api/acount'
import { onBeforeMount } from '@vue/runtime-core'
import { UserOutlined, KeyOutlined } from '@ant-design/icons-vue'

// PersonForm的类
class PersonForm {
  // 值
  constructor() {
    // 客户姓名
    this.username = 'admin'
    // 客户号码
    this.password = '123456'
    // 验证码
    this.code = 'gstd'
    // 客户来源
    this.uuid = ''
  }
  // 验证方法
  static getRule() {
    return {
      username: [
        { required: true, message: '请输入用户名称', trigger: 'blur' }
      ],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
    }
  }
}
export default {
  name: 'Login',
  components: {
    UserOutlined,
    KeyOutlined
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      title: defaultSettings.title,
      codeUrl: '',
      loading: false,
      dataFrom: new PersonForm(),
      // 表单验证
      dataFromRules: PersonForm.getRule()
    })
    // 获取列表
    onBeforeMount(async () => {
      getCode()
    })
    // 获取验证码
    const getCode = async () => {
      let { code, data } = await sendCode()
      if (code === 200) {
        state.codeUrl = 'data:image/png;base64,' + data.img
        state.dataFrom.uuid = data.uuid
      }
    }
    // 表单提交
    const handleFinish = async (values) => {
      state.loading = true
      try {
        let token = await store.dispatch('user/Login', state.dataFrom)
        let myMessage = await store.dispatch('user/GetInfo', token)
        console.log(token, myMessage)
        if (token && myMessage) {
          console.log(router)
          router.push({ path: '/' })
          state.loading = false
        } else {
          state.getCode()
          state.loading = false
        }
      } catch (error) {
        getCode()
        state.loading = false
      }
    }
    return {
      ...toRefs(state),
      handleFinish,
      getCode
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 200vmax;
$height: 200vmax;
$excursion_top: 50%;
$excursion_left: 50%;
/* 背景样式 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &:hover,
  &:active {
    .top,
    .bottom {
      &:before,
      &:after {
        margin-left: 200px;
        transform-origin: -200px 50%;
        transition-delay: 0s;
      }
    }

    .center {
      opacity: 1;
      transition-delay: 0.2s;
    }
  }
}

.top,
.bottom {
  &:before,
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: $width;
    height: $height;
    top: $excursion_top;
    left: $excursion_left;
    margin-top: -100vmax;
    transform-origin: 0 50%;
    transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
    z-index: 10;
    opacity: 0.65;
    transition-delay: 0.2s;
  }
}

.top {
  &:before {
    transform: rotate(45deg);
    background: #e46569;
  }
  &:after {
    transform: rotate(135deg);
    background: #ecaf81;
  }
}

.bottom {
  &:before {
    transform: rotate(-45deg);
    background: #60b8d4;
  }
  &:after {
    transform: rotate(-135deg);
    background: #3745b5;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: rgba(0, 0, 0, 0.85);
$excursion_top: 50%;
$excursion_left: 50%;
.center {
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // opacity: 0;
  transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
  transition-delay: 0s;
  background-color: rgba(255, 255, 255, 0.13);
  position: absolute;
  transform: translate(-50%, -50%);
  top: $excursion_top;
  left: $excursion_left;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(104, 100, 131, 0.6);
  padding: 0 35px;
  z-index: 10;
  .login-form {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 0 5px 0 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 20px;
      color: $dark_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .veriCodeImg {
    width: 100%;
    height: 40px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .login-btn {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>
