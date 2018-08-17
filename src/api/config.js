export const commonParams = {
    //g_tk: 1928093487,
    g_tk: 884354906,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp'
  }
  
  export const options = {
    param: 'jsonpCallback'
  }

  //解决 jsonp请求返回数据 回调函数名 不存在
  export const options1 = {
    param: 'jsonpCallback',
    prefix: 'playlistinfoCallback'
 }
  
  export const ERR_OK = 0