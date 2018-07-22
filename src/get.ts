type Scope = { [key: string]: any } | null | undefined;

/**
 * Recursively goes through an object trying to resolve a path.
 *
 * @param {Object} scope - The object to traverse (in each recursive call we dig into this object)
 * @param {string[]} path - An array of property names to traverse one-by-one
 * @param {number} [pathIndex=0] - The current index in the path array
 */
function _recursivePathResolver(scope: Scope, path: string[], pathIndex: number = 0) : any {
  if (typeof scope !== 'object' || scope === null || scope === undefined) {
    return '';
  }

  const varName: string = path[pathIndex];
  const value: any = scope[varName];

  if (pathIndex === path.length - 1) {
    // It's a leaf, return whatever it is
    return value;
  }

  return _recursivePathResolver(value, path, ++pathIndex);
}

function _normalize(path: string) : string[] {
  return path
    .replace(/\[\s*['"]?/g, '.')
    .replace(/['"]?\s*\]/g, '')
    .replace(/^\./, '')
    .split('.');
}

/**
 * Similar to lodash _.get()
 *
 * @throws TypeError if the object variable is not an object
 * @param {Object} scope - the view object
 * @param {string} path - the variable path to lookup
 * @returns {*} returns the value or undefined. If path or scope are undefined or scope is null the result is always undefined.
 */
export default function get(scope: Scope, path: string | undefined) {
  if (path === undefined || scope === undefined || scope === null) {
    return undefined;
  }
  if (typeof scope !== 'object') {
    throw new TypeError(`The scope parameter should be an object but got ${scope}`);
  }
  if (typeof path !== 'string') {
    throw new TypeError(`When specified the path parameter should be a string but got ${path}`);
  }
  const normalizedPath = _normalize(path);
  return _recursivePathResolver(scope, normalizedPath);
}

