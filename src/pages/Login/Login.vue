<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: loginType}" @click="loginType = true">短信登录</a>
            <a href="javascript:;" :class="{on: !loginType}" @click="loginType = false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="logion">
            <div :class="{on: loginType}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone || computedTime>0" class="get_verification" :class="{black_style: rightPhone && computedTime<=0}"
                @click.prevent="getCode">{{computedTime>0 ? `已发送（${computedTime}s）` : '获取验证码'}}</button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on: !loginType}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" autocomplete="new-password" maxlength="8" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd ? 'on' : 'off'" @click="showPwd = !showPwd">
                    <div class="switch_circle" :class="{right: showPwd}"></div>
                    <span class="switch_text">{{showPwd ? 'abc' : ''}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:3000/captcha" alt="captcha" ref="captcha" @click="getCaptcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-fanhui"></i>
        </a>
      </div>

      <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"/>
    </section>
</template>
<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqSendCode, reqPhoneLogin, reqNameLogin} from '../../api/index'
export default {
  data () {
    return {
      loginType: true, // true 代表短信验证码登录 false 代表密码登录
      phone: null, // 手机号码
      code: null, // 验证码
      computedTime: 0,
      name: null, // 用户名
      showPwd: false, // 密码是否可见
      pwd: null, // 密码
      captcha: null, // 图形验证码
      alertText: '',
      alertShow: false,
      intervalId: null
    }
  },
  computed: {
    rightPhone () {
      return /^1[3456789]\d{9}$/.test(this.phone)
    }
  },
  methods: {
    async getCode () {
      // 获取验证码
      if (!this.computedTime) {
        this.computedTime = 30
        this.intervalId = setInterval(() => {
          this.computedTime -= 1
          if (this.computedTime <= 0) {
            clearInterval(this.intervalId);
          }
        }, 1000)
        // 异步请求：
        const result = await reqSendCode(this.phone)
        if (result.code === 1) {
          // 发送失败
          this.showAlertTip('验证码发送失败')
          if (this.computedTime) {
            this.computedTime = 0
            clearInterval(this.intervalId)
            this.intervalId = null
          }
        }
      }
    },
    showAlertTip (tiptext) {
      this.alertText = tiptext
      this.alertShow = true
    },
    // 登录
    async logion () {
      if (this.loginType) {
        // 短信验证码登录
        const {rightPhone, phone, code} = this
        if (!rightPhone || !phone) {
          this.showAlertTip('手机号码不正确')
          return
        } else if (!code) {
          this.showAlertTip('验证码不正确')
          return
        }
        // 异步请求：
        const result = await reqPhoneLogin(this.phone, this.code)
        if (result.code === 0) {
          // 登录成功
          this.$store.dispatch('updateUserInfo', result.data)
          this.$router.replace('/profile');
        } else {
          // 登录失败
          this.showAlertTip(result.msg)
          this.computedTime = 0
        }
      } else {
        // 密码登录
        const {name, pwd, captcha} = this
        if (!name) {
          this.showAlertTip('用户名不正确')
          return
        } else if (!pwd) {
          this.showAlertTip('密码不正确')
          return
        } else if (!captcha) {
          this.showAlertTip('验证码不正确')
          return
        }
        // 异步请求：
        const result = await reqNameLogin(name, pwd, captcha)
        if (result.code === 0) {
          // 登录成功
          this.$store.dispatch('updateUserInfo', result.data)
          this.$router.replace('/profile');
        } else {
          // 登录失败
          this.showAlertTip(result.msg)
          this.getCaptcha()
        }
      }
    },
    closeTip () {
      this.alertText = ''
      this.alertShow = false
    },
    // 获取图形验证码
    getCaptcha () {
      let d = new Date()
      this.$refs.captcha.src = 'http://localhost:3000/captcha?time' + d.getTime()
    }
  },
  components: {
    AlertTip
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl";
.loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
            .login_logo
                font-size 40px
                font-weight bold
                color #02a774
                text-align center
            .login_header_title
                padding-top 40px
                text-align center
                >a
                    color #333
                    font-size 14px
                    padding-bottom 4px
                    &:first-child
                        margin-right 40px
                    &.on
                        color #02a774
                        font-weight 700
                        border-bottom 2px solid #02a774
        .login_content
            >form
                >div
                    display none
                    &.on
                        display block
                    input
                        width 100%
                        height 100%
                        padding-left 10px
                        box-sizing border-box
                        border 1px solid #ddd
                        border-radius 4px
                        outline 0
                        font 400 14px Arial
                        &:focus
                            border 1px solid #02a774
                    .login_message
                        position relative
                        margin-top 16px
                        height 48px
                        font-size 14px
                        background #fff
                        .get_verification
                          position absolute
                          top 50%
                          right 10px
                          transform translateY(-50%)
                          border 0
                          color #ccc
                          font-size 14px
                          background transparent
                          &.black_style
                            color black
                    .login_verification
                        position relative
                        margin-top 16px
                        height 48px
                        font-size 14px
                        background #fff
                        .switch_button
                            font-size 12px
                            border 1px solid #ddd
                            border-radius 8px
                            transition background-color .3s,border-color .3s
                            padding 0 6px
                            width 30px
                            height 16px
                            line-height 16px
                            color #fff
                            position absolute
                            top 50%
                            right 10px
                            transform translateY(-50%)
                            &.off
                                background #fff
                                .switch_text
                                    float right
                                    color #ddd
                            &.on
                                background #02a774
                            >.switch_circle
                              //transform translateX(27px)
                              position absolute
                              top -1px
                              left -1px
                              width 16px
                              height 16px
                              border 1px solid #ddd
                              border-radius 50%
                              background #fff
                              box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                              transition transform .3s
                              &.right
                                transform translateX(30px)
                    .login_hint
                        margin-top 12px
                        color #999
                        font-size 14px
                        line-height 20px
                        >a
                            color #02a774
                .login_submit
                    display block
                    width 100%
                    height 42px
                    margin-top 30px
                    border-radius 4px
                    background #4cd96f
                    color #fff
                    text-align center
                    font-size 16px
                    line-height 42px
                    border 0
            .about_us
                display block
                font-size 12px
                margin-top 20px
                text-align center
                color #999
        .go_back
            position absolute
            top 5px
            left 5px
            width 30px
            height 30px
            >.iconfont
                font-size 20px
                color #999
</style>
