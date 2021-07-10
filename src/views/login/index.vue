<template>
  <div class="login-container">
      <van-nav-bar
      class="app-nav-bar "
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!--
      基于Vant表单验证;
      1.使用van-form组件包裹所有的表单项 van-field
      2.给van-from绑定submit事件
        当表单提交的时候会触发submit事件
        提示：只有表单验证通过才会调用submit
      3.使用filed的rules属性定义校验规则
     -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      @failed="onFailed"
      @submit="onLogin"
      ref="login-form"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
      <template #button>
        <van-count-down
          v-if="isCountDownShow"
          :time="1000 * 60"
          format='ss s'
          @finish="isCountDownShow = false"
        />
        <van-button
          v-else
          class="send-btn"
          size="mini" round
          :loading="isSendSmsLoading"
          @click.prevent="onSendSms"
          >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          type="info"
          block
          native-type="submit"
        >登录</van-button>
      </div>
    </van-form>
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[35789]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false // 发送验证码按钮的loading
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLogin () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      // 1.找到数据接口
      // 2.封装请求方法
      // 3.请求调用登录
      try {
        const res = await login(this.user)
        console.log(res)
        this.$toast.success('登录成功')
      } catch (err) {
        console.log(err)
        console.log('登录失败' + err)
        this.$toast.fail('登录失败')
      }
      // 4.处理响应结果
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
      }
    },
    // 发送验证码
    async onSendSms () {
      try {
        await this.$refs['login-form'].validate('mobile')
        // 验证通过请求发送验证码
        this.isSendSmsLoading = true // 展示按钮loading状态防止多次触发行为
        const res = await sendSms(this.user.mobile)
        console.log(res)
        // 隐藏发送按钮，显示倒计时
        this.isCountDownShow = true
      } catch (err) {
        // try 里面任何代码的错误都会进入catch
        // 不同的错误需要有不同的提示，那就需要判断
        console.log(err)
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的提示
          message = '发送太频繁，请稍后重试'
        } else if (err.name === 'mobile') {
          message = err.message
        } else {
          message = '发送失败，请稍后重试'
        }
        this.$toast({
          message: message, // 提示消息
          position: 'top' // 防止手机键盘太高看不见提示消息
        })
        // 无论发送成功失败关闭loading
        this.isSendSmsLoading = false
        // 发送失败，显示发送按钮，关闭倒计时
        this.isCountDownShow = false
      }
      // 校验手机号码
      // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
      // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
      // 倒计时结束 -> 隐藏倒计时，显示发送按钮
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
        font-size: 11px;
        color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border:none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
