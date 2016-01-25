local = !top.location.hostname

isSpeechEnabled = ->
  window.localStorage?.speechEnabled == 'true'

isTellTimeEnabled = ->
  window.localStorage?.tellTime == 'true'

gameParamsInitialState =
  type: if local then 'seconds' else 'random'
  min: 5
  max: 10
  minutes: if local then 1 else 3
  seconds: if local then 30 else 300
  error: false
  speechEnabled: isSpeechEnabled()
  tellTime: isTellTimeEnabled()

isGtZero = (val) -> _.isFinite(val) and +val > 0

gameParamValid = (prop, val, state) ->
  if prop == 'random'
    return false unless isGtZero(state.min) and isGtZero(state.max)
  else
    return false unless isGtZero(val)
  if prop == 'min'
    +val <= +state.max
  else if prop == 'max'
    +val >= +state.min
  else if prop == 'random'
    +state.min <= +state.max
  else
    true

gameParams = (state = gameParamsInitialState, action) ->
  switch action.type
    when 'changeType'
      dup(state, type: action.selected, error: not gameParamValid(action.selected, state[action.selected], state))
    when 'changeVal'
      dup(state, make(action.prop, action.val), error: not gameParamValid(action.prop, action.val, state))
    when 'toggleSpeech'
      speechEnabled = not state.speechEnabled
      window.localStorage?.speechEnabled = speechEnabled
      dup(state, speechEnabled: speechEnabled)
    when 'toggleTellTime'
      tellTime = not state.tellTime
      window.localStorage?.tellTime = tellTime
      dup(state, tellTime: tellTime)
    else
      state

calculateTargetTime = ->
  params = store.getState().gameParams
  switch params.type
    when 'random'
      _.random(params.min * 60, params.max * 60)
    when 'minutes'
      +params.minutes * 60
    when 'seconds'
      +params.seconds
