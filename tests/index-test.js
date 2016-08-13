import React from 'react'
import expect from 'expect'
import createDecorator from 'src/'
import Preact, { h } from 'preact'

function renderToString(element, { render } = Preact) {
  render(element, element = document.createElement('div'))
  element = element.innerHTML
  console.log(element) // innerHTML failed mysteriously
  return element
}

const render = e => renderToString(e, require('react-dom'))

// given a HOC
const Container = ({ children, title=null }) =>
  <div>{ title }
    { children }
  </div>

// and a component to be wrapped
const Component = ({ text }) => <p>{ text }</p>

var enhance, WrappedComponent, ExpectedComponent =
  ({ title, text }) =>
    <Container title={ title }>
      <Component text={ text }/>
    </Container>

describe('As function', () => {
  it('should work with functional components', () => {
    enhance = createDecorator(Container)
    WrappedComponent = enhance(Component)

    expect(
      render(<WrappedComponent text='Hello' />)
    )
      .toBe(
        render(
          <ExpectedComponent text='Hello' />
        )
      )
  })

  it('should work with stateful components', () => {
    enhance = createDecorator(Container)
    WrappedComponent = enhance(
      React.createClass({ render() { return Component(this.props) }})
    )

    expect(
      render(<WrappedComponent text='Hello' />)
    )
      .toBe(
        render(
          <ExpectedComponent text='Hello' />
        )
      )
  })

  it("should work with container's props", () => {
    const title = 'Hello', props = {
      title, text: 'world'
    }

    enhance = createDecorator(Container)
    WrappedComponent = enhance(Component, { title })

    expect(
      render(<WrappedComponent text={props.text} />)
    )
      .toBe(
        render(
          <ExpectedComponent { ...props } />
        )
      )
  })
})

describe('As decorator', () => {
  it("should work", () => {
    enhance = createDecorator(Container)

    @enhance
    class WrapedComponent extends React.Component {
      render() { return Component(this.props) }
    }

    expect(
      render(<WrapedComponent text='world' />)
    )
      .toBe(
        render(
          <ExpectedComponent text='world' />
        )
      )
  })

  it("should work with options", () => {
    const title = 'Hello', props = {
      title, text: 'world'
    }

    enhance = createDecorator(Container)

    @enhance({ title: 'Hello' })
    class WrappedComponent extends React.Component {
      render() { return Component(this.props) }
    }

    expect(
      render(<WrappedComponent text={props.text} />)
    )
      .toBe(
        render(
          <ExpectedComponent { ...props } />
        )
      )
  })
})

describe('With preact pragma', () => {
  const Container = ({ children, title }) =>
    h('div', { title }, children)

  function Component({ text }) {
    return h('p', { text })
  }

  const props = { title: 'Hello' }

  it("should work", () => {
    enhance = createDecorator(Container, { pragma: h })

    @enhance(props)
    class WrappedComponent extends Preact.Component {
      render() { return Component(this.props) }
    }

    expect(
      renderToString(
        h(WrappedComponent, { text: 'world' })
      )
    )
    .toBe(
      renderToString(
        h(Container, { ...props },
          h(Component, { text: 'world' })
        )
      )
    )
  })

  it("should work with bind", () => {
    enhance = createDecorator.bind({ pragma: h })(Container)
    @enhance(props)
    class WrappedComponent extends Preact.Component {
      render() { return Component(this.props) }
    }

    expect(
      renderToString(
        h(WrappedComponent, { text: 'world' })
      )
    )
    .toBe(
      renderToString(
        h(Container, { ...props },
          h(Component, { text: 'world' })
        )
      )
    )
  })
})

describe('With custom enhancer', () => {
  function enhancer(Component, Container, options) {
    return props => (
      options = { ...options, ...props },
      <Container {...options}>
        <Component {...props} />
      </Container>
    )
  }

  it("should work", () => {
    enhance = createDecorator(Container, enhancer)
    WrappedComponent = enhance(Component)

    const props = { title: 'Hello', text: ' world' }

    expect(
      render(<WrappedComponent { ...props } />)
    )
      .toBe(
        render(
          <ExpectedComponent { ...props } />
        )
      )
  })

  it("should override binding", () => {
    enhance = createDecorator
      .bind({ pragma: 'dummy', enhancer: 'dummy' })
      (Container, enhancer)

    WrappedComponent = enhance(Component)

    const props = { title: 'Hello', text: ' world' }

    expect(
      render(<WrappedComponent { ...props } />)
    )
      .toBe(
        render(
          <ExpectedComponent { ...props } />
        )
      )
  })
})
