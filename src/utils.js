const unique = (collection, uniqueAttr) => {
  if (!uniqueAttr){
    return Array.from( new Set(collection) )
  }
  const set = new Set()
  const result = []
  collection.forEach(item => {
    if (!set.has( item[uniqueAttr] )){
      set.add(item[uniqueAttr])
      result.push(item)
    }
  })
  return result
}

const memoize = (wrappedFn) =>
  (arg) => wrappedFn(arg)

module.exports = {
  unique,
  memoize,
}
