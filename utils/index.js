export const isEmpty = obj => Object.keys(obj).length === 0;
export const isKeysExistsInObject = (obj, keys) => keys.filter(item => !([item] in obj)).length === 0;
export const minifyObjectByKeys = (obj, keys) => keys.reduce((acc, cur) => [cur] in obj && { ...acc, [cur]: obj[cur] }, {});
