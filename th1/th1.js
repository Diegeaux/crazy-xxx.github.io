// Generated by CoffeeScript 1.10.0
var TH1Main, button, div, form, h1, h3, h4, img, input, label, li, option, p, ref, select, span, strong, ul;

ref = React.DOM, button = ref.button, div = ref.div, form = ref.form, img = ref.img, h1 = ref.h1, h3 = ref.h3, h4 = ref.h4, input = ref.input, label = ref.label, li = ref.li, option = ref.option, p = ref.p, select = ref.select, span = ref.span, strong = ref.strong, ul = ref.ul;

TH1Main = React.createClass({displayName: "TH1Main",
  getInitialState: function() {
    return {
      started: false
    };
  },
  startAnother: function() {
    return this.setState({
      started: false,
      A: void 0
    });
  },
  render: function() {
    return div({
      className: "container"
    }, h1({}, 'TH1Main'));
  }
});

ReactDOM.render(React.createElement(TH1Main, null), document.getElementById('content'));
