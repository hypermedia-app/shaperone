function resolveImport({ source }) {
  if (/rdf-js/.test(source)) {
    return '/rdf.js'
  }

  return undefined
}

function serve({ path }) {
  if (path === '/rdf.js') {
    return { body: 'export default {};' }
  }

  return undefined
}

module.exports = { resolveImport, serve }
