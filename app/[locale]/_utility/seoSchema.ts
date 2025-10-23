export function safeJsonLdStringify(obj): string {
  let str = JSON.stringify(obj);
  str = str.replace(/<\/script/gi, '<\\/script');
  str = str.replace(/<script/gi, '\\u003Cscript');
  str = str.replace(/<!--/g, '\\u003C!--');
  str = str.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  str = str.replace(/\u0000/g, '\\u0000');

  return str;
}
