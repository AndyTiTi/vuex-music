import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getGroupRadioList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg'
  
    const data = Object.assign({}, commonParams, {
      channel:'radio',
      page:'index',
      tpl:'wk',
      new:1,
      p:Math.random(),
      uin: 0,
      needNewCode: 0,
      platform: 'yqq'
    })
    return jsonp(url, data, options)
}

export function getRadioSonglist(radioId) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  let data = {"songlist":{"module":"pf.radiosvr","method":"GetRadiosonglist","param":{"id":parseInt(radioId),"firstplay":1,"num":10}}}
  const datas = Object.assign({}, commonParams, {
    needNewCode: 0,
    callback:'getradiosonglist47197189254706573',
    jsonpCallback:'getradiosonglist47197189254706573',
    hostUin:0,
    g_tk:'5381',
    loginUin:'1369526524', // 必须登录个性电台不登录 查不到数据报400
    // format:'json',
    platform: 'yqq',
    data:JSON.stringify(data)
  })
  return jsonp(url, datas, {})
}

export function getPersonalityRadio() {
  const url = 'https://c.y.qq.com/rcmusic2/fcgi-bin/fcg_guess_youlike_pc.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 0,
    cid:703,
    hostUin:0,
    loginUin:'1369526524',
    platform: 'yqq',
  })
  return jsonp(url, data, options)
}