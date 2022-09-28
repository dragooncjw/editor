// 规则来源：https://bytedance.feishu.cn/base/bascnRXTmKD9zv35et5HxZPPWxb?table=tblPtNyLjszM5wnM&view=vewA5Y89Mx
import { isEmpty } from 'lodash';

const getOffsetKey = (token) => {
  return [token.startOffset, token.endOffset].join(',')
}

const getOffsetSum = (token) => {
  if (token.image) {
    // 匹配token
    return token.startOffset + token.endOffset
  } else {
    // 匹配rule
    return token.location.startOffset + token.location.endOffset
  }
}

export const dfsSetFunctionType = (root, functionType, idx) => {
  const currentNode = root

  // 只有clauseParams的时候才设置idx，括号外就不触发识别了。
  if (currentNode.name === 'clauseParams') {
    let childrenArr = []
    // 1. 获取所有value的item
    Object.values(currentNode.children).forEach(item => {
      childrenArr = childrenArr.concat(item)
    })
    // 2. 排序
    childrenArr.sort((a, b) => 
      getOffsetSum(a) - getOffsetSum(b)
    )
    let paramIndex = 0
    childrenArr.forEach((item) => {
      // 17表示token是Comma，逗号的出现说明要+1
      if (item.tokenTypeIdx === 17) {
        paramIndex += 1
      }
      dfsSetFunctionType(item, functionType, paramIndex)
    })
  } else if (currentNode.name === "calcClause") {
    currentNode.functionType = functionType
    currentNode.idx = idx

    const newFunctionType = currentNode.children.FunctionType[0].image

    currentNode.children.FunctionType[0].functionType = newFunctionType
    currentNode.children.FunctionType[0].idx = 0

    dfsSetFunctionType(currentNode.children.bracketRule[0], newFunctionType, 0)
  } else {
    if (!isEmpty(currentNode.children)) {
      Object.keys(currentNode.children).forEach(key => {
        const itemArr = currentNode.children[key]
        itemArr.forEach((item, index) => {
          if (!item.image) {
            currentNode.children[key][index].functionType = functionType
            currentNode.children[key][index].idx = idx

            dfsSetFunctionType(item, functionType, idx)
          } else {
            currentNode.children[key][index].functionType = functionType
            currentNode.children[key][index].idx = idx
          }
        })
      })
    } else {
      currentNode.functionType = functionType
      currentNode.idx = idx
    }
  }
}


// 这个函数遍历是用于提取当前token所在的位置，高亮function内的参数的
export const getToken = (root, token) => {
  const tokenMeta = token.tokenMeta;
  // 通过开始和结尾的offset定位唯一token
  const offsetKey = getOffsetKey(tokenMeta)

  // 先设置对应变量
  dfsSetFunctionType(root, '', 0)

  console.log('asdklasjld 处理后的root', root)

  const stack = [root];

  let findResult = false;
  let functionType = ''
  let actionIndex = ''

  while(stack.length && !findResult) {
    const currentNode = stack.pop()
    // children非空
    if (!isEmpty(currentNode.children)) {
      // children有两种类型
      // 1. token
      // 2. rule
      // 需要再push进去的是rule
      // 需要遍历获取位置的是token
      Object.values(currentNode.children).forEach((itemArr, index) => {
        itemArr.forEach(item => {
          if (!isEmpty(item.children)) {
            stack.push(item)
          } else {
            // 没有children说明不是rule
            // 进行token比对
            const nodeOffsetKey = getOffsetKey(item)

            if (nodeOffsetKey === offsetKey) {
              console.log('asdklasjld 找到对应的token了~', item)
              findResult = true;
              functionType = item.functionType;
              actionIndex = item.idx
            }
          }
        })
      })
    }
  }

  return {
    functionType,
    actionIndex
  }
}