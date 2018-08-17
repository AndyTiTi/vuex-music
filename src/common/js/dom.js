export function addClass(el,className){
    
     if (hasClass(el, className)) {
        return
      }
      let newClass = el.className.split(' ')
      newClass.push(className)
      el.className = newClass.join(' ')
}

export function hasClass(el,className){
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

export function getData(el, name, val) {
    const prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
  }

  let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getColor(val) {
  if(val == 0){
    return '#707070'
  }else{
    var value = parseInt(-val)
    var val = 0xff000000 | value
    val = val.toString(16).substring(1)
    var str = ''
    //当返回的颜色值没有达到六位时  
    if (val.length < 6) {  
        var i = 6 - val.length
        for (var t = 0; t < i; t++) {  
            str += '0'
        }  
    }  
    return '#' + str + val
  }

}
