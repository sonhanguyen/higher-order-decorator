# higer-order-decorator

Given a container, return the equivalent decorator/enhancer

#####Usage:

```js
var Card = ({ children, title }) =>
  <div>{ title }
    { children }
  </div>

var createDecorator = require('higher-order-decorator')
var withTitle = createDecorator(Card)

Component = withTitle(Component)
// or
Component = withTitle(Component, { title: 'some title' })

@withTitle
class Component {
  // ...
}

@withTitle({ title: 'some title' })
class Component {
  // ...
}

// with jsx pragma
import { h as pragma } from 'preact'
createDecorator = createDecorator.bind({ pragma })
```
#####This is stupid, the component is not gonna be useful if props are fixed like that!
Then your container is not smart enough, how about this?

```js
Card = ({ children, ...props }) => (
  { title } = { ...children.props, ...props },
  <div>{ title }
    { children }
  </div>
)
```
#####I have a lot of containers and I don't want to write that in all of them.

Fair enough, sounds like you need a custom enhancing logic. _createDecorator_ actually takes a second parameter:
```js
function enhancer(Component, Container, options) {
  return props => (
    // bear in mind this still violates one-way data flow and will cause PropTypes warnings
    options = { ...options, ...props },
    // the next 3 lines are taken from default enhancer
    <Container {...options}>
      <Component {...props} />
    </Container>
  )
}

createDecorator = createDecorator.bind({ enhancer })
// alternatively (or later, when you override)
withTitle = createDecorator(Card, enhancer)

```
*(pragma will be ignored)*
