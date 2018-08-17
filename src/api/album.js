import {commonParams, options , options1} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getAlbumDetail(albummid) {
const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'
  
const data = Object.assign({}, commonParams, {
    albummid:albummid,
    hostUin:0,
    platform:'yqq',
    needNewCode:0
 })
  
    return jsonp(url, data, options)
}

