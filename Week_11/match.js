function match(selector, element) {

  const childList = element.children

  const { idName, className } = format(selector)

  for(let item of childList) {
    // console.log(item, item.childNodes)
    // const childNodes = item.childNodes
    const clsName = item.className
    console.log(clsName)
    const parentName = item.parentNode.getAttribute('id')
    console.log(parentName)
    if(parentName == idName && clsName.indexOf(className) > -1) {
      return true
    }

  }

  return false
}


function format(selector) {
  const list = selector.split('.')
  const prefix = list[0]
  const idName = prefix.split('#')[1]
  return {
    className: list[1],
    idName
  }
}

let a = match("div #id.class", document.getElementById("id"));
console.log(a)
