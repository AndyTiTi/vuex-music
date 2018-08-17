import {getLyric,getVkey} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id,mid,singer,name,album,duration,image,payalbum,url}){
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.payalbum = payalbum
        this.url = url
    }

    getLyric() {
        if (this.lyric) {
          return Promise.resolve(this.lyric)
        }
    
        return new Promise((resolve, reject) => {
          getLyric(this.id).then((res) => {
            if (res.retcode === ERR_OK) {
              this.lyric = Base64.decode(res.lyric)
              resolve(this.lyric)
            } else {
              reject('no lyric')
            }
          })
        })
      }


}



export function createSong(musicData,url,newSong){
   return new Song({
       id: newSong ? musicData.id : musicData.songid,
       mid: newSong ? musicData.mid : musicData.songmid,
       singer: filterSinger(musicData.singer),
       name: newSong ? musicData.name : musicData.songname,
       album: newSong ? musicData.album.name : musicData.albumname,
       duration: musicData.interval,
       // payalbum: musicData.pay.payalbum, //是否是付费歌曲 1为付费 0为免费
       image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${newSong ? musicData.album.mid : musicData.albummid}.jpg?max_age=2592000`,
       url: url
       
       //播放源地址 暂时都不可以用 最新url为动态获取vkey来绑定
       //url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`        
       //url: `http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
       //url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=46`
       //url:`http://thirdparty.gtimg.com/C100${musicData.songmid}.m4a?fromtag=38`
   })
}

export function filterSinger(singer){
   let ret  = []
   if(!singer){
     return ''
   }
   singer.forEach((s) => {
       ret.push(s.name)
   })
   return ret.join('/')
}