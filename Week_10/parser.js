const css = require('css')
const layout = require('./layout.js')

const EOF = Symbol('EOF') // 终结符
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [
  {
    type: 'document',
    children: []
  }
]
let rules = [] // css rules

function emit(token) {
  // console.log(token)
  const { type = '', tagName = '' } = token
  

  let top = stack[stack.length - 1]

  if(type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attribute: []
    }

    element.tagName = tagName

    for(let p in token) {
      if(p != 'type' || p != 'tagName') {
        element.attribute.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCSS(element)
    layout(element)

    top.children.push(element)
    element.parent = top

    if(!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null
  } else if(type == 'endTag') {
    if(top.tagName != token.tagName) {
      throw new Error("tag start end doesn't match")
    } else {
      if(top.tagName == 'style') {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    layout(top)
    currentTextNode = null
  } else if(type == 'text') {
    if(currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if(c == '<') {
    return tagOpen
  } else if(c === EOF) {
    emit({
      type: 'EOF'
    })
    return 
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagName(c) {
  if(c.match(/^[\t\n\f ]$/)) { // 结束标签
    return beforeAttribuiteName
  } else if(c == '/') {
    return selfClosingStartTag
  } else if(c.match(/^[A-Z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if(c == '>') {
    emit(currentToken)
    return data
  } else {
    currentToken.tagName += c
    return tagName
  }
}

function tagOpen(c) {
  if(c == '/') {
    return endTagOpen
  } else if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    emit({
      type: 'text',
      content: c
    })
    retrun 
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else if(c == '>') {

  } else if(c == EOF) {

  } else {

  }
}

function beforeAttribuiteName(c) {
  if(c.match(/^[\t\n\f ]$/)) { // 结束标签
    return beforeAttribuiteName
  } else if(c == '>' || c == '/' || c == EOF) {
    return afterAttributeName(c)
  } else if(c == '=') {
    // return beforeAttribuiteName
  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
    // return beforeAttribuiteName
  }
}

function selfClosingStartTag(c) {
  if(c == '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if(c == 'EOF') {

  } else {

  }
}

function afterAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName
  } else if(c == "/") {
    return selfClosingStartTag
  } else if(c == "=") {
    return beforeAttributeValue
  }else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == EOF) {

  } else if(c =='\u0000') {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  } else if(c == '=') {
    return beforeAttributeValue
  } else if(c == '\u0000') {

  } else if(c == "\"" || c == "'" || c == '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/) || c == '/' || c == '>' || c == EOF) {
    return beforeAttributeValue
  } else if(c == "\"") {
    return doubleQuotedAttributeValue
  } else if(c == "\'") {
    return sigleQuotedAttributeValue
  } else if(c == ">") {
    return data
  } else {
    return UnquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if(c == "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if(c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function sigleQuotedAttributeValue(c) {
  if(c == "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if(c == '\u0000') {

  } else if (c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
    //     return sigleQuotedAttributeValue

  }
}

function UnquotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttribuiteName
  } else if(c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == EOF) {

  } else if(c =='\u0000') {

  } else if(c =="\"" || c == "'" || c == '<' || c == '=' || c == '`') {

  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)) {
    return beforeAttribuiteName
  } else if(c == "/") {
    return selfClosingStartTag
  } else if(c == '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if(c == EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function addCSSRules(text) { // css存入数组
  const cssAst = css.parse(text) 
  // console.log(JSON.stringify(cssAst, null , '     '))
  rules.push(...cssAst.stylesheet.rules)
  
}

function computeCSS(element) {
  const ele = stack.slice().reverse() // 获取当前元素的父元素，从内向外

  if(!element.computeStyle) {
    element.computeStyle = {}
  }

  for(let rule of rules) {
    const selectParts = rule.selectors[0].split(' ').reverse()

    if(!match(element, selectParts[0])) {
      continue
    }

    let matched = false

    let j = 1

    for(let i = 0; i < ele.length; i++) {
      if(match(ele[i], selectParts[j])) {
        j++
      }
    }

    if(j >= selectParts.length) {
      matched = true
    }

    if(matched) {
      // 匹配到就将其加入dom
      const sp = specificity(rule.selectors[0])
      const computeStyle = element.computeStyle
      for(let declaration of rule.declarations) {
        if(!computeStyle[declaration.property]) {
          computeStyle[declaration.property] = {}
        }

        if(!computeStyle[declaration.property].specificity) {
          computeStyle[declaration.property].value = declaration.value
          computeStyle[declaration.property].specificity = sp
        } else if(compare(computeStyle[declaration.property].specificity, sp) < 0) {
          for(var k = 0; k < 4; k++) {
            computeStyle[declaration.property][declaration.value][k] = sp[k]
          }
        }

        // computeStyle[declaration.property].value = declaration.value
      }

      console.log(element.computeStyle)
    }
  }

}


function match(element, selector) {
  if(!selector || !element.attribute) {
    return false
  }
  if(selector.charAt(0) == '#') {
    const attr = element.attribute.filter(item => item.name == 'id')[0]
    if(attr && attr.value == selector.replace('#', '')) {
      return true
    }
  } else if(selector.charAt(0) == '.') {
    const attr = element.attribute.filter(item => item.name == 'class')[0]
    if(attr && attr.value == selector.replace('.', '')) {
      return true
    }
  } else {
    if(element.tagName == selector) {
      return true
    }
  }

}

function specificity(selector) {
  let p = [0, 0, 0, 0]
  const selectorParts = selector.split(' ')
  for(let part of selectorParts) {
    if(part.charAt(0) == '#') {
      p[1] += 1
    } else if(part.charAt(0) == '.') {
      p[2] +=1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compare(sp1, sp2) {
  if(sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if(sp1[1] - sp2[1])
    return sp1[1] - sp2[1]
  if(sp1[2] - sp2[2])
    return sp1[2] - sp2[2]
  
  return sp1[3] - sp2[3]
}

module.exports.parserHtml = function(html) {
  // console.log(html)
  let state = data
  for(let c of html) {
    state = state(c)
  }
  state = state('EOF')
  return stack[0]
}

