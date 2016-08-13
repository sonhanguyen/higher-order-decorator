export default function(
    wrapper,
    {
      enhancer = typeof arguments[1] == 'function'
        ? arguments[1].pragma = arguments[1] // dummy pragma
        // whole thing is just some ergonomy around this default enhancer
        : (component, container, options) =>
          props => $(container, options,
            $(component, props)
          )
      ,
      pragma: $ = require('react').createElement
    } = this || {} // sugar for bind()
  ) {
    return function (options, component) {
      return typeof arguments[0] == 'function' // if first param is actually a component
        ? ( // correct the names
          [ component, options ] = [ ...arguments ],
          decorate(component)
        ) // decorator curried with options
        : decorate

      function decorate(target) {
        return enhancer(target, wrapper, options)
      }
    }
  }
