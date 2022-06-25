import { Parser, Options } from 'acorn'
import literal from './plugins/literal'

const syntaxPlugins = {
  literal
}

const defaultOptions = {
  plugins: []
}

const parse = function (code: string, options: Options & {
  plugins?: string[]
}) {
  const resolvedOptions = Object.assign({}, defaultOptions, options)
  const nextParser = resolvedOptions.plugins.reduce((Parser, pluginName) => {
    let plugin = syntaxPlugins[pluginName]
    return plugin ? Parser.extend(plugin) : Parser
  }, Parser)

  return nextParser.parse(code, {
    locations: true,
    ecmaVersion: 'latest'
  })
}

export {
  parse
}
