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

const stringifyArguments = (args) => JSON.stringify(args)

const SEPARATOR = '_'
const memoize = (wrappedFn) => {
  const cache = {} // key: fn param, value: fn result
  return (...args) => {
    if( args.some(arg => typeof arg === 'function')){
      throw new Error('Functions are not supported as memoize parameters')
    }
    // const key = args.join(SEPARATOR)
    const key = JSON.stringify(args)
    // const key = stringifyArguments(args)
    if(!cache[key]){
      cache[key] = wrappedFn(...args)
    }
    return cache[key]
  }
}

// promiseFn: () => Promise<X>
const cachePromise = (promiseFn) => {
  let req
  return () => {
    if(!req){
      req = promiseFn()
    }
    return req
  }
}

module.exports = {
  unique,
  memoize,
  cachePromise,
}
