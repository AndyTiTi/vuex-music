<template>
    <div class="about">
      <div class="head-wrapper">
        <div class="head" @click="showImage=true" v-model="showImage">
            <img class="headimg" src="./wangjiahuan.jpg" alt="">
        </div>
      </div>
      <div class="name-wrapper">
          <span class="name">AndyTiTi</span>
      </div>
      <div class="birth-wrapper">
          <i class="new-icon-birth"></i>
          <span class="from">Shijiazhuang,China</span>
      </div>
      <div class="desc-wrapper">
          <span class="desc">专注于前端开发，分享知识，共享快乐。</span>
      </div>
      <div class="github-wrapper">
          <i class="new-icon-github"></i>
          <div class="git-right">
             <span class="title">GitHub</span>
             <a class="github" href="https://github.com/AndyTiTi/vue-music">https://github.com/AndyTiTi/vue-music</a>
          </div>
      </div>
      <div class="email-wrapper">
          <i class="new-icon-email"></i>
          <div class="email-right">
             <span class="title">Email</span>
             <span class="email" >18034557574@163.com</span>
          </div>
      </div>

      <div class="qq-wrapper">
          <i class="new-icon-qqabout"></i>
          <div class="qq-right">
             <span class="title">QQ</span>
             <span class="qq">458666482</span>
          </div>
      </div>

      <div class="version-wrapper" @click="showVersion=true" v-model="showVersion">
          <i class="new-icon-version"></i>
          <div class="version-right">
             <span class="title">VerSion</span>
             <span class="version">1.0.0</span>
          </div>
      </div>

      <div class="copyright-wrapper" :style="topStyle">
          <div class="copyright-right">
              <div class="copyright-d">
               <span class="title">AndyTiTi</span>
               <span class="text">版权所有</span>
              </div>
             <span class="copyright">Copyright© 2018 Wangjiahuan Rights Reserved</span>
          </div>
      </div>
      
      <div v-transfer-dom >
        <x-dialog class="dialog-demo" v-model="showVersion" :dialog-style="{'max-width': '100%', width: '80%', height: '50%', 'background-color': 'transparent'}">
          <p style="color:#fff;text-align:center;">
            <img width="150px" height="150px" src="../../common/image/default.png" >
            <br>
            <span style="font-size:18px;">Love Music</span>
            <span style="font-size:18px;">1.0.0</span>
            <br>
            <br>
            <span style="font-size:18px;line-height:25px">一款自己独立开发的基于 Vue 全家桶 (2.x)，可以媲美原生的移动端音乐 WebApp，项目完整、功能完备、UI美观、交互一流。</span>
            <br>
            <br> 
            <x-icon type="ios-close-outline" style="fill:#fff;" @click="showVersion = false"></x-icon>
          </p>
        </x-dialog>
      </div>
      <div v-transfer-dom>
            <x-dialog v-model="showImage" class="dialog-demo" hide-on-blur>
              <div class="img-box">
                <img src="./wangjiahuan.jpg" style="max-width:100%">
              </div>
              <x-icon type="ios-close-outline" style="fill:#956d39;" @click="showImage = false"></x-icon>
            </x-dialog>
          </div>
      </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'
  import { XDialog , TransferDomDirective as TransferDom } from 'vux'
  export default {
    mixins: [playlistMixin],
    directives: {
      TransferDom
    },
    data() {
      return {
          length:false,
          showVersion:false,
          showImage:false
      }
    },
    computed: {
      topStyle(){
         if(this.length){
           return 'top:' + (window.innerHeight-102) + 'px'
         }else{
             return 'top:'+ (window.innerHeight-45) +'px'
         }
      }
    },
    methods: {
      handlePlaylist(playlist) {
        playlist.length > 0 ? this.length = true : this.length = false
      },
    },
    components: {
      XDialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .about
    position: fixed
    top: 88px
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    .head-wrapper
      display :flex
      justify-content :center
      .head
        display :flex
        justify-content :center
        align-items :center
        margin-top :15px
        height:140px
        width:140px
        background-size:100%
        border-radius: 50%
        background-color:rgba(255, 255, 255, 0.2)
        z-index :2
        .headimg
            height:130px
            width:130px
            border-radius: 50%
    .name-wrapper
      display :flex
      justify-content :center
      margin-top :15px
      .name
        color:$color-text
    .birth-wrapper
      display :flex
      justify-content :center
      margin-top :10px
      align-items :center
      .new-icon-birth
        margin-right :5px
      .from
        color:$color-text-l
    .desc-wrapper
      display :flex
      justify-content :center
      margin-top :15px
      height:45px
      background : $color-highlight-background
      align-items :center
      .desc
        color:$color-text-l
        font-size :$font-size-medium-s
    .github-wrapper
      display :flex
      margin-top :25px
      margin-left :10px
      .new-icon-github
        font-size :35px
        margin-right :15px
      .git-right
        display :flex
        flex-direction :column
        .title
          color:$color-text
          margin-bottom :5px
        .github
          color:$color-text-l
          font-size :$font-size-medium
    .email-wrapper
      display :flex
      margin-top :25px
      margin-left :10px
      .new-icon-email
        font-size :35px
        margin-right :15px
      .email-right
        display :flex
        flex-direction :column
        .title
          color:$color-text
          margin-bottom :5px
        .email
          color:$color-text-l
          font-size :$font-size-medium
    .qq-wrapper
      display :flex
      margin-top :25px
      margin-left :10px
      .new-icon-qqabout
        font-size :38px
        margin-right :12px
      .qq-right
        display :flex
        flex-direction :column
        .title
          color:$color-text
          margin-bottom :8px
        .qq
          color:$color-text-l
          font-size :$font-size-medium
    .version-wrapper
      display :flex
      margin-top :25px
      margin-left :10px
      .new-icon-version
        font-size :38px
        margin-right :12px
      .version-right
        display :flex
        flex-direction :column
        .title
          color:$color-text
          margin-bottom :8px
        .version
          color:$color-text-l
          font-size :$font-size-medium
    .copyright-wrapper
      position:fixed
      left:0
      right:0
      bottom :0
      .copyright-right
        display :flex
        flex-direction :column
        align-items :center
        .copyright-d
          color :$color-text-d
          margin-bottom :5px
          .title
            font-size:$font-size-small-x
          .text
            font-size:$font-size-small
        .copyright
          font-size :$font-size-small-x
          color :$color-text-d
    .dialog-demo
      .img-box 
        height: 350px
        overflow: hidden
        .wrapper
          background-color  :white
          height:100px
      .vux-close 
        margin-top: 8px
        margin-bottom: 8px
  
  
</style>