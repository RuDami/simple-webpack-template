const fs = require('fs');
const path = require('path');


const isEmptyObject = (obj) => {
  for (const i in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(i)) {
      return false;
    }
  }
  return true;
}
// Пример
// <include src="./path-to-root-html.html"/>
// <include src="path-to-html.html"/>
function processNestedHtml(content, loaderContext, resourcePath = '') {
  let fileDir = resourcePath === ''
    ? path.dirname(loaderContext.resourcePath)
    : path.dirname(resourcePath);


  // const INCLUDE_PATTERN = /\<include path=\"(\.\/)?(.+)\"\/?\>([^\<\/inclu\d\e\>]*)(?:\<\/include\>)?/gi;
  // const INCLUDE_PATTERN = /\<include path=\"(\.\/)?(.+)\".?(?:attributes\=\{(.*)\})?\/?\>([^\<\/inclu\d\e\>]*)(?:\<\/include\>)?/gi;
  const INCLUDE_PATTERN = /\<include path=\"(\.\/)?([^"]+)\".+?(?:attributes\='(\{.*\})')?\/?\>(([^\r]*)(?=\<\/include\>)(?:\<\/include\>))?/gi;


  const replaceNestedSrc = (parentFileDir) => (fullMatch, tag, filePath) => {
    const mainPath = path.resolve(parentFileDir, filePath)
    // console.log('mainPath', mainPath)
    const relativePathLoader = path.relative(loaderContext.context, mainPath)
    // console.log(`relativePathLoader`,  relativePathLoader)
    // console.log(`${tag}${relativePathLoader}"`)
    return `${tag}${relativePathLoader}"`;
  }

  function replaceHtml(match, pathRule, src, attributes, contentWithTag, content) {
    if (pathRule === './') {
      fileDir = loaderContext.context;
    }
    const INCLUDE_SRC__PATTERN = /(src=")([^:]*?)"/gi;
    const INCLUDE_HREF__PATTERN = /(href=")([^:#]*?)"/gi;
    // const INCLUDE_BLOCK__PATTERN = /(path=")([^:#]*?)"/gi;


    const filePath = path.resolve(fileDir, src);
    const fileResDir = path.dirname(filePath);
    // console.log('fileResDir', fileResDir)
    let html = fs.readFileSync(filePath, 'utf8');
    let newHtml = html
    let parsedAttrs = null

    if (INCLUDE_SRC__PATTERN.test(html)) {
      newHtml = html.replace(INCLUDE_SRC__PATTERN, replaceNestedSrc(fileResDir));
    }
    if (INCLUDE_HREF__PATTERN.test(html)) {
      newHtml = newHtml.replace(INCLUDE_HREF__PATTERN, replaceNestedSrc(fileResDir));
    }
    // if (INCLUDE_BLOCK__PATTERN.test(html)) {
    //   newHtml = newHtml.replace(INCLUDE_BLOCK__PATTERN, replaceNestedSrc(fileResDir));
    // }
    if(attributes) {
      try {
        parsedAttrs = JSON.parse(attributes)
        if (!isEmptyObject(parsedAttrs)) {
          Object.entries(parsedAttrs).map(([name, value]) => {
            const regString = new RegExp('\\$\\{' +name + '\\}',"gi");
            newHtml = newHtml.replace(regString, value)
          })
        }
      }catch (e) {
        console.log('e', e)
      }
    }

    newHtml = `${newHtml}${content ? content : ''}`
    loaderContext.dependency(filePath);
    return processNestedHtml(newHtml, loaderContext, filePath);
  }

  if (!INCLUDE_PATTERN.test(content)) {
    // console.log('content', content)
    return content;
  }
  return content.replace(INCLUDE_PATTERN, replaceHtml);
}

function processHtmlLoader(content, loaderContext) {
  return processNestedHtml(content, loaderContext);
}

module.exports = processHtmlLoader;
