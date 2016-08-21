// Generated by CoffeeScript 1.10.0
var ConfigForm, GameComponent, MTMain, a, br, button, calculateTargetTime, combinePairs, cxs, div, dup, el, form, game, gameInitialState, gameParamValid, gameParams, gameParamsDefaults, gameParamsInitialState, getRandomsCxs, gxs, h1, h2, h3, h4, img, input, isGtZero, label, li, local, make, memoryLogic, option, p, parseQueryParams, prepareTesting, ref, render, saveDup, select, small, span, speak, startingGameState, store, strong, timer, ul, wait,
  slice = [].slice;

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
    return div({}, p({
      className: "lead"
    }, 'The game is not started yet. Select training time and press Start.'), form({
      className: "form-inline",
      onSubmit: this.startGame
    }, br({}), button({
      type: "submit",
      className: "btn btn-primary btn-lg",
      disabled: this.props.error
    }, 'Start training')));
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
    return div({}, this.props.finished ? this.renderFinished() : this.learningPhase() ? this.renderLearning() : this.renderTesting(), this.renderPreloader());
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
    }, h1({}, 'Learning phase'), p({}, "You're going to see " + this.props.pairs.length + " pairs of images. Try to remember which images goes with which."));
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
    return div({}, this.currentPair() ? this.renderTestingPair() : this.renderTestingIntro());
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
    }, this.props.wrongAnswer ? h3({}, "Oops! Wrong answer! You need to repeat your test!") : h1({}, 'Testing phase'), p({}, "Now it's time for your test. You must match image pairs that you saw earlier. Click on the correct image to proceed."), div({
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
  renderCxs: function() {
    var cxs;
    cxs = this.currentPair().slice(1);
    return div({}, _.map(cxs, (function(_this) {
      return function(cx) {
        return div({
          className: 'row'
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
        marginBottom: 10
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
        wrongAnswer: true,
        currentTest: -1
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

gxs = ['http://65.media.tumblr.com/2a364e7c86e3236c1ac8e2cb6b32f833/tumblr_njpduz9LOX1rodxovo6_1280.jpg', 'http://65.media.tumblr.com/70adc6a801dd9e8cd8c66c5e70458a61/tumblr_njnha11WIq1rodxovo2_1280.jpg', 'http://66.media.tumblr.com/921a7e8b72362699c5f372cd5f243cec/tumblr_nlcobhjaFf1rodxovo7_1280.png', 'http://66.media.tumblr.com/d8efdf8a71cb33ef9a39bf8210c84e59/tumblr_njlmes8g0g1rodxovo3_1280.jpg'];

cxs = ['http://67.media.tumblr.com/acdc00fba1174c0400bf167534241b4a/tumblr_o74ou7Gc6p1qcv09ro3_1280.jpg', 'http://66.media.tumblr.com/044dcc65c6b60dd40098f435530cd911/tumblr_nxn8ix0wSH1ro1zebo1_1280.jpg', 'http://65.media.tumblr.com/ac00120ad8c7de3b1472a7c1adbb10d1/tumblr_nw2ih9zsjI1qkxrtro1_1280.png', 'http://66.media.tumblr.com/328c3523d732d026f66f57a4a6eb64b9/tumblr_nw2ih9zsjI1qkxrtro4_1280.png'];

combinePairs = function() {
  var sc, sg;
  sg = _.shuffle(gxs);
  sc = _.shuffle(cxs);
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

wait = 0;

timer = function() {
  game = store.getState().game;
  if (!game.started) {
    return;
  }
  if (game.countdown && (!responsiveVoice.isPlaying() || wait++ > 1)) {
    wait = 0;
    return store.dispatch({
      type: 'decreaseCountdown'
    });
  } else if (game.running) {
    if (0 === game.tasks.length || 0 === game.tasks[0].time) {
      return store.dispatch({
        type: 'nextTask'
      });
    } else {
      return store.dispatch({
        type: 'decreaseTask'
      });
    }
  }
};

setInterval(timer, 1000);

local = !top.location.hostname;

gameParamsDefaults = {
  error: false
};

parseQueryParams = function() {
  return _.object(_.map(top.location.search.substr(1).split(/&/), function(kv) {
    return kv.split(/=/);
  }));
};

gameParamsInitialState = function() {
  var ref;
  return _.assign({}, gameParamsDefaults, JSON.parse(((ref = window.localStorage) != null ? ref.gameParams : void 0) || "{}"), parseQueryParams());
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
    ref.gameParams = JSON.stringify(newState);
  }
  return newState;
};

gameParams = function(state, action) {
  if (state == null) {
    state = gameParamsInitialState();
  }
  switch (action.type) {
    case 'changeType':
      return saveDup(state, {
        type: action.selected,
        error: !gameParamValid(action.selected, state[action.selected], state)
      });
    case 'changeVal':
      return saveDup(state, make(action.prop, action.val), {
        error: !gameParamValid(action.prop, action.val, state)
      });
    case 'toggleSpeech':
      return saveDup(state, {
        speechEnabled: !state.speechEnabled
      });
    case 'toggleTellTime':
      return saveDup(state, {
        tellTime: !state.tellTime
      });
    default:
      return state;
  }
};

calculateTargetTime = function() {
  var params;
  params = store.getState().gameParams;
  switch (params.type) {
    case 'random':
      return _.random(params.min * 60, params.max * 60);
    case 'minutes':
      return +params.minutes * 60;
    case 'seconds':
      return +params.seconds;
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
    }, h1({}, 'Memory Test'), this.props.game.started ? el(GameComponent, this.props.game) : el(ConfigForm, this.props.gameParams));
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
