// Generated by CoffeeScript 1.10.0
var ConfigForm, GameComponent, MTMain, MinMaxSelector, NumberSelector, a, br, button, combinePairs, cxs, div, dup, el, form, game, gameInitialState, gameParamValid, gameParams, gameParamsDefaults, gameParamsInitialState, getRandomsCxs, gxs, h1, h2, h3, h4, img, input, isGtZero, label, li, local, make, memoryLogic, option, p, parseQueryParams, prepareTesting, ref, render, saveDup, select, small, span, speak, startingGameState, store, strong, ul, wrongAnswerState,
  slice = [].slice;

NumberSelector = React.createClass({
  label: function() {
    return this.props.label || 'Value';
  },
  render: function() {
    return div({
      className: "form-group " + (this.props.hasError ? 'has-error' : void 0)
    }, label({}, this.label() + ': ', div({
      className: 'input-group'
    }, input({
      type: 'number',
      className: "form-control",
      value: this.props.value,
      onChange: this.props.onChange,
      step: 'any',
      min: this.props.min,
      max: this.props.max
    }))));
  }
});

MinMaxSelector = React.createClass({
  handleChange: function(fld, e) {
    return store.dispatch({
      type: 'changeVal',
      prop: fld,
      val: e.target.value
    });
  },
  render: function() {
    return span({}, el(NumberSelector, {
      label: 'Min',
      value: this.props.min,
      onChange: this.handleChange.bind(this, 'min'),
      hasError: this.props.error
    }), el(NumberSelector, {
      label: 'Max',
      value: this.props.max,
      onChange: this.handleChange.bind(this, 'max'),
      hasError: this.props.error
    }));
  }
});

ConfigForm = React.createClass({
  startGame: function(e) {
    e.preventDefault();
    if (!this.props.error) {
      return store.dispatch({
        type: 'startGame'
      });
    }
  },
  render: function() {
    return div({
      className: ''
    }, p({
      className: "lead"
    }, 'The game is not started yet. Select training time and press Start.'), form({
      className: "",
      onSubmit: this.startGame
    }, el(NumberSelector, {
      label: 'Number of pairs',
      value: this.props.numberOfPairs,
      onChange: this.numberOfPairsChanged,
      hasError: this.props.error,
      min: 1,
      max: gxs.length
    }), div({
      className: "form-group"
    }, label({}, 'On wrong answer: '), select({
      className: "form-control",
      defaultValue: this.props.onWrongAnswer,
      onChange: this.onWrongAnswerChanged,
      style: {
        width: 'auto'
      }
    }, option({
      value: 'retry'
    }, 'Retry same picture'), option({
      value: 'restart'
    }, 'Restart test'), option({
      value: 'learning'
    }, 'Restart learning'), option({
      value: 'randomize'
    }, 'Randomize then restart learning'))), button({
      type: "submit",
      className: "btn btn-primary btn-lg",
      disabled: this.props.error
    }, 'Start training')));
  },
  numberOfPairsChanged: function(e) {
    return store.dispatch({
      type: 'numberOfPairsChanged',
      value: e.target.value
    });
  },
  onWrongAnswerChanged: function(e) {
    return store.dispatch({
      type: 'onWrongAnswerChanged',
      value: e.target.value
    });
  }
});

GameComponent = React.createClass({
  getInitialState: function() {
    return {
      disabledContinue: true
    };
  },
  componentDidMount: function() {
    return this.interval = setInterval((function(_this) {
      return function() {
        var allLoaded;
        allLoaded = true;
        $('.observedImage').each(function(_, img) {
          return allLoaded && (allLoaded = img.complete && img.naturalWidth > 0);
        });
        if (allLoaded === _this.state.disabledContinue) {
          return _this.setState({
            disabledContinue: !allLoaded
          });
        }
      };
    })(this), 100);
  },
  componentWillUnmount: function() {
    if (this.interval) {
      return clearInterval(this.interval);
    }
  },
  render: function() {
    return div({}, this.props.wrongAnswer ? this.renderWrongAnswer() : this.props.finished ? this.renderFinished() : this.learningPhase() ? this.renderLearning() : this.renderTesting(), this.renderPreloader());
  },
  renderWrongAnswer: function() {
    return div({
      className: "jumbotron"
    }, h3({}, "Oops! Wrong answer! You need to " + (this.wrongAnswerReaction()) + "."), div({
      className: 'row',
      style: {
        marginTop: 25
      }
    }, button({
      type: "submit",
      className: "btn btn-primary btn-lg center-block",
      onClick: this.clearWrongAnswer
    }, 'Continue')));
  },
  clearWrongAnswer: function() {
    return store.dispatch({
      type: 'clearWrongAnswer'
    });
  },
  renderFinished: function() {
    return div({
      className: "jumbotron"
    }, h1({}, 'Congratulations! You passed!'), div({
      className: 'row',
      style: {
        marginTop: 25
      }
    }, button({
      type: "submit",
      className: "btn btn-success btn-lg center-block",
      onClick: this.newGame
    }, 'Start another game')));
  },
  newGame: function() {
    return store.dispatch({
      type: 'newGame'
    });
  },
  renderLearning: function() {
    return div({}, this.currentPair() ? this.renderLearningPair() : this.renderLearningIntro(), div({
      className: 'row',
      style: {
        marginTop: 25
      }
    }, button({
      type: "submit",
      className: "btn btn-primary btn-lg center-block",
      onClick: this.nextLearning,
      disabled: this.state.disabledContinue
    }, this.state.disabledContinue ? span({}, img({
      src: '../vendor/gears.gif'
    }), ' Caching images...') : 'Continue')));
  },
  renderLearningIntro: function() {
    return div({
      className: "jumbotron"
    }, h1({}, 'Learning phase'), p({}, "You're going to see " + this.props.pairs.length + " pairs of images. Try to remember which image goes with which."));
  },
  renderLearningPair: function() {
    return div({
      className: 'row'
    }, div({
      className: 'col-xs-6'
    }, this.gxImage()), div({
      className: 'col-xs-6'
    }, this.cxImage()));
  },
  renderTesting: function() {
    if (this.currentPair()) {
      return this.renderTestingPair();
    } else {
      return this.renderTestingIntro();
    }
  },
  renderTestingPair: function() {
    return div({
      className: 'row'
    }, div({
      className: 'col-xs-6'
    }, this.gxImage()), div({
      className: 'col-xs-6'
    }, this.renderCxs()));
  },
  renderTestingIntro: function() {
    return div({
      className: "jumbotron"
    }, h1({}, 'Testing phase'), p({}, "Now it's time for your test. You must match image pairs that you saw earlier. Click on the correct image to proceed."), div({
      className: 'row',
      style: {
        marginTop: 25
      }
    }, button({
      type: "submit",
      className: "btn btn-primary btn-lg center-block",
      onClick: this.nextTest
    }, 'Continue')));
  },
  wrongAnswerReaction: function() {
    switch (store.getState().gameParams.onWrongAnswer) {
      case 'retry':
        return 'retry this picture';
      case 'restart':
        return 'restart the test';
      case 'learning':
        return 'repeat the learning of the same pairs';
      case 'randomize':
        return 'learn a new set of pairs';
    }
  },
  renderCxs: function() {
    var cxs;
    cxs = _.shuffle(this.currentPair().slice(1));
    return div({}, _.map(cxs, (function(_this) {
      return function(cx) {
        return div({
          className: 'row',
          key: cx
        }, _this.smallCxImage(cx));
      };
    })(this)));
  },
  currentPair: function() {
    if (this.learningPhase()) {
      return this.props.pairs[this.props.currentLearning];
    } else {
      return this.props.pairs[this.props.currentTest];
    }
  },
  learningPhase: function() {
    return 'learning' === this.props.phase;
  },
  gxImage: function() {
    return this.halfSizeImage(this.currentPair()[0], 'right');
  },
  cxImage: function() {
    return this.halfSizeImage(this.currentPair()[1], 'left');
  },
  halfSizeImage: function(url, align) {
    return img({
      src: url,
      className: 'observedImage',
      style: {
        maxHeight: '80vh',
        maxWidth: '100%',
        float: align
      }
    });
  },
  smallCxImage: function(url, align) {
    if (align == null) {
      align = 'left';
    }
    return img({
      src: url,
      className: 'observedImage',
      style: {
        maxHeight: '25vh',
        maxWidth: '100%',
        float: align,
        marginBottom: 10,
        cursor: 'pointer'
      },
      onClick: this.checkAnswer
    });
  },
  checkAnswer: function(e) {
    if (e.target.src === this.currentPair()[1]) {
      return store.dispatch({
        type: 'nextTest'
      });
    } else {
      return store.dispatch({
        type: 'wrongAnswer'
      });
    }
  },
  nextLearning: function() {
    this.setState({
      disabledContinue: true
    });
    return store.dispatch({
      type: 'nextLearning'
    });
  },
  nextTest: function() {
    return store.dispatch({
      type: 'nextTest'
    });
  },
  nextPair: function() {
    if (this.learningPhase()) {
      return this.props.pairs[this.props.currentLearning + 1];
    } else {
      return this.props.pairs[this.props.currentTest + 1];
    }
  },
  renderPreloader: function() {
    var pair;
    if (pair = this.nextPair()) {
      return div({
        style: {
          display: 'none'
        }
      }, _.map(pair, function(url) {
        return img({
          src: url,
          key: url,
          className: 'observedImage'
        });
      }));
    }
  }
});

gameInitialState = {
  started: false
};

game = function(state, action) {
  if (state == null) {
    state = gameInitialState;
  }
  switch (action.type) {
    case 'startGame':
      return dup(state, startingGameState());
    case 'newGame':
      return dup(gameInitialState);
    case 'nextLearning':
      if (state.currentLearning + 1 < state.pairs.length) {
        return dup(state, {
          currentLearning: state.currentLearning + 1
        });
      } else {
        return dup(state, prepareTesting(state.pairs));
      }
      break;
    case 'nextTest':
      if (state.currentTest + 1 < state.pairs.length) {
        return dup(state, {
          currentTest: state.currentTest + 1
        });
      } else {
        return dup(state, {
          finished: true
        });
      }
      break;
    case 'wrongAnswer':
      return dup(state, {
        wrongAnswer: true
      }, wrongAnswerState());
    case 'clearWrongAnswer':
      return dup(state, {
        wrongAnswer: false
      });
    default:
      return state;
  }
};

startingGameState = function() {
  return {
    started: true,
    phase: 'learning',
    currentLearning: -1,
    pairs: combinePairs()
  };
};

gxs = ['http://66.media.tumblr.com/2f89f3f34d68ea4bca8611d1d49d24d3/tumblr_oc4k5qIUMD1unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/b3b07eacdc76bead27531a18d84598c4/tumblr_oc4mp6XlYh1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/e12077b854342e61f521a98aa718ba56/tumblr_oc3asbyFir1unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/1c417d987228a81dcb55970443237a3b/tumblr_obzgzuNH5z1unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/a8f30d98a664ef1c68c3e10dc67a3d72/tumblr_occ7alwcQP1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/c4230e32674d2bba5c02abff19b8ced9/tumblr_occdb8EUge1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/b38b8066f845bc6a031180cf1c3cfbf1/tumblr_ocbm84EJ9d1unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/46ef10a36c533c33fc01bbcc0ea8c0b9/tumblr_oc9y9wtBCp1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/0bfb44b030e97aafc995af332e90311d/tumblr_oc7xghbuvn1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/22b193f8c6baadd66140e0983b9ba984/tumblr_oc6ya90GJO1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/b3176f056eb03b440b00fb4155a2963f/tumblr_oc2bqg7mRw1unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/d3184d8b7f4be22867bb396925aa8c90/tumblr_obyic54ka61unmtsfo1_1280.jpg', 'http://68.media.tumblr.com/0ccc0a4ecadcb8590bd69db129f15f6e/tumblr_occln1DZ2l1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/1e3da67e6b12bcec565dd66a118a3821/tumblr_ocbzn7lZAk1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/b142b37fc8da9babfd443735e558a8fe/tumblr_ocbvhesW0v1unmtsfo1_1280.jpg', 'http://66.media.tumblr.com/19706c3603e0fca45d59f5e038a22148/tumblr_ocbci4l6PA1unmtsfo1_1280.jpg'];

cxs = ['http://68.media.tumblr.com/bf3fb8b3ff7ef7359cf692770f423db1/tumblr_oagmq610es1smjd03o1_1280.jpg', 'http://66.media.tumblr.com/a2625616a8080f4d33e9d0d9cec3c42f/tumblr_o901637P6S1qdueojo1_1280.jpg', 'http://66.media.tumblr.com/d100fd6fbee8188c2ea4fd1763e95d81/tumblr_o1nm920xfU1qfbh7io1_1280.jpg', 'http://68.media.tumblr.com/de4ec3bf28ced31cbad5f4225e14c472/tumblr_o93nijX2vc1uynf4mo1_1280.jpg', 'http://66.media.tumblr.com/46cec95fc9d764b563117028fa70f337/tumblr_oas3j4gQyc1s3l69so1_1280.jpg', 'http://68.media.tumblr.com/4b7f9e2c7cf1212b841238b917e23928/tumblr_o8r5e6ihiq1u1hkmao1_1280.jpg', 'http://66.media.tumblr.com/4481cde801fdcfcc3b7b7bc565f06bb4/tumblr_o6vo1tWwAl1s3l69so1_1280.jpg', 'http://68.media.tumblr.com/07f0accbaf1c54e1c4a3e807050333a4/tumblr_obeu1r4aDL1uynf4mo1_1280.jpg', 'http://68.media.tumblr.com/9f4ab43f2fe30fbaf59233d60beb4d8e/tumblr_o0k6owMYvD1u7o2a0o1_1280.jpg', 'http://68.media.tumblr.com/ea23f92d7d037eb43edf24311e416332/tumblr_oaoeg1pWjG1s22t8fo1_1280.jpg', 'http://68.media.tumblr.com/bff62ffc14cc2c71fbf8678db64dbda6/tumblr_o91rkmT65q1uynf4mo1_1280.jpg', 'http://68.media.tumblr.com/56ee2cf203427c1cc7ccbf612f6b14f5/tumblr_oaaxg1uXAU1ukekago1_1280.jpg', 'http://66.media.tumblr.com/c477611a5c5c089e3d10d362d949c264/tumblr_o0zye0y5151tfrxy1o1_1280.jpg', 'http://68.media.tumblr.com/681537b666cb07148f5381be9092d9a6/tumblr_oamiq4DkEf1r68jvoo1_1280.png', 'http://66.media.tumblr.com/563615feefca381df4233fceb48942cb/tumblr_ob3n27HBWS1rdcdxpo1_1280.jpg', 'http://68.media.tumblr.com/b7e5c3c543b31203fb96ecfffc21a281/tumblr_nnut8mrm8m1uq0201o1_1280.jpg'];

combinePairs = function() {
  var numberOfPairs, sc, sg;
  numberOfPairs = store.getState().gameParams.numberOfPairs;
  sg = _.shuffle(gxs).slice(0, numberOfPairs);
  sc = _.shuffle(cxs).slice(0, numberOfPairs);
  return _.map(_.zip(sg, sc), function(a) {
    return [a[0]].concat(getRandomsCxs(a[1]));
  });
};

prepareTesting = function(pairs) {
  return {
    phase: 'testing',
    currentTest: -1,
    pairs: _.shuffle(pairs)
  };
};

wrongAnswerState = function() {
  switch (store.getState().gameParams.onWrongAnswer) {
    case 'retry':
      return {};
    case 'restart':
      return {
        currentTest: -1
      };
    case 'learning':
      return {
        currentLearning: -1,
        phase: 'learning'
      };
    case 'randomize':
      return this.startingGameState();
  }
};

getRandomsCxs = function(cx) {
  var rc, res;
  res = [cx];
  while (res.length < 3) {
    rc = _.sample(cxs);
    if (!_.contains(res, rc)) {
      res.push(rc);
    }
  }
  return res;
};

local = !top.location.hostname;

gameParamsDefaults = {
  error: false,
  numberOfPairs: gxs.length,
  onWrongAnswer: 'restart'
};

parseQueryParams = function() {
  return _.object(_.map(top.location.search.substr(1).split(/&/), function(kv) {
    return kv.split(/=/);
  }));
};

gameParamsInitialState = function() {
  var ref;
  return _.assign({}, gameParamsDefaults, JSON.parse(((ref = window.localStorage) != null ? ref.gameParamsMT : void 0) || "{}"), parseQueryParams());
};

isGtZero = function(val) {
  return _.isFinite(val) && +val > 0;
};

gameParamValid = function(prop, val, state) {
  if (prop === 'random') {
    if (!(isGtZero(state.min) && isGtZero(state.max))) {
      return false;
    }
  } else {
    if (!isGtZero(val)) {
      return false;
    }
  }
  if (prop === 'min') {
    return +val <= +state.max;
  } else if (prop === 'max') {
    return +val >= +state.min;
  } else if (prop === 'random') {
    return +state.min <= +state.max;
  } else {
    return true;
  }
};

saveDup = function() {
  var newState, objs, ref;
  objs = 1 <= arguments.length ? slice.call(arguments, 0) : [];
  newState = dup.apply(null, objs);
  if ((ref = window.localStorage) != null) {
    ref.gameParamsMT = JSON.stringify(newState);
  }
  return newState;
};

gameParams = function(state, action) {
  if (state == null) {
    state = gameParamsInitialState();
  }
  switch (action.type) {
    case 'numberOfPairsChanged':
      return saveDup(state, {
        numberOfPairs: action.value
      });
    case 'onWrongAnswerChanged':
      return saveDup(state, {
        onWrongAnswer: action.value
      });
    default:
      return state;
  }
};

ref = React.DOM, a = ref.a, br = ref.br, button = ref.button, div = ref.div, form = ref.form, img = ref.img, h1 = ref.h1, h2 = ref.h2, h3 = ref.h3, h4 = ref.h4, input = ref.input, label = ref.label, li = ref.li, option = ref.option, p = ref.p, select = ref.select, small = ref.small, span = ref.span, strong = ref.strong, ul = ref.ul;

el = React.createElement;

make = function(prop, val) {
  var obj;
  obj = {};
  obj[prop] = val;
  return obj;
};

dup = function() {
  var objs, state;
  state = arguments[0], objs = 2 <= arguments.length ? slice.call(arguments, 1) : [];
  return _.assign.apply(_, [{}, state].concat(slice.call(objs)));
};

memoryLogic = Redux.combineReducers({
  gameParams: gameParams,
  game: game
});

store = Redux.createStore(memoryLogic);

MTMain = React.createClass({
  render: function() {
    return div({
      className: "container"
    }, h1({}, 'Babe/Cock Memory Test'), this.props.game.started ? el(GameComponent, this.props.game) : el(ConfigForm, this.props.gameParams));
  }
});

render = function() {
  return ReactDOM.render(el(MTMain, store.getState()), document.getElementById('content'));
};

store.subscribe(render);

render();

if (local) {
  store.subscribe(function() {
    return console.log('current state', JSON.stringify(store.getState()));
  });
}

speak = function(task) {
  if (store.getState().gameParams.speechEnabled) {
    responsiveVoice.speak(task, "UK English Female", {
      rate: 0.8
    });
  }
  return task;
};