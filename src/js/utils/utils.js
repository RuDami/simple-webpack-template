import isEqual from "lodash/isEqual";

export const compose = (...func) => (comp) => {
  return func.reduceRight(
    (previousValue, f) => f(previousValue), comp
  )
}
export const composeValidators = (...validators) => (value, values = {}, meta = {}) =>
  validators.reduce((error, validator) => error || validator(value, values, meta), undefined);


export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


export const memoize = fn => {
  let lastArg;
  let lastResult;

  return (...args) => {
    console.log('args', args)
    console.log('lastArg', lastArg)
    const syncs = lastArg ? args.map((arg, i) => {
      if (typeof arg === 'object') {
        return isEqual(arg, lastArg[i])
      }
      return arg === lastArg[i]
    }) : []
    console.log('syncs', syncs)

    const equalsArgs = syncs.length ? syncs.some(elem => elem === false) : true
    console.log('equalsArgs', equalsArgs)
    if (equalsArgs) {
      lastArg = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
};
export const memoize1 = fn => {
  let lastArg;
  let lastResult;

  return (...args) => {
    console.log('args', args)
    console.log('lastArg', lastArg)

    const equalsArgs = isEqual(args, lastArg)
    console.log('equalsArgs', equalsArgs)
    if (!equalsArgs) {
      lastArg = args;
      lastResult = fn(...args);
    }
    return lastResult;
  };
};
export const simpleMemoize = fn => {
  let lastArgs;
  let lastResult;
  return (value, values, meta)  => {
    if ((value !== lastArgs?.value) || (value !== lastArgs?.value && meta && meta.active)) {
      lastArgs = {value, values, meta};
      lastResult = fn(value, values, meta);
    }
    return lastResult;
  };
};

/**
 * Equivalent to `||` but for functions. Takes array of functions and applies to them subsequent arguments. Yields the
 * first truthy result of the functions, or, when all functions returns falsy, the last result.
 */
export const overOr = (fns) => (...args) => {
  let result;
  // eslint-disable-next-line no-cond-assign
  for (let fn, i = 0; (fn = fns[i]); i += 1) {
    // eslint-disable-next-line no-cond-assign
    if ((result = fn(...args))) break;
  }
  return result;
};


/**
 * Yields first validation message or undefined when all validators passes
 */
export const pipeValidators = (...validators) => overOr(validators);



export function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
export function eraseCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
