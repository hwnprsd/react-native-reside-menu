import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  Easing,
} from 'react-native';
import PropTypes from 'prop-types';


export default class ResideMenu extends Component {
  state = {
    animatedValueX: 0,
    animatedVelocity: 0,
    resideState: 0,
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  }
  _panResponder;
  handler = dims => this.setState(dims.window);
  render() {
    const { width, height } = this.state;
    const style = {
      width, height,
    }

    const animatedStyle = {
      transform: [
        {
          translateX: this.animatedValue.x.interpolate({
            inputRange: [-200, -50, 0, 50, 200],
            outputRange: [-60, 0, 0, 0, 60]
          })
        },
        {
          scale: this.animatedValue.x.interpolate({
            inputRange: [-200, -50, 0, 50, 200],
            outputRange: [0.8, 1, 1, 1, 0.8]
          })
        }
      ]
    }

    return (
      <View style={style}>
        <this.props.HiddenComponent />
        <Animated.View
          style={[animatedStyle, style, { position: 'absolute' }]}
          {...this._panResponder.panHandlers}
        >
          <this.props.VisibleComponent />
        </Animated.View>
      </View>
    )
  }

  _resetReside = () => {
    Animated.spring(this.animatedValue.x, {
      toValue: 0,
      useNativeDriver: true
    }).start()
  }
  xCoord = this.props.xCoord || 300;
  _helper = (animatedX, xVelocity, xTouchLocation) => {
    const CENTER = 170;
    if (xVelocity > 0) {
      if (animatedX > this.xCoord)
        return this.xCoord;
      if (animatedX < 0)
        return 0;
      if (animatedX > 0)
        return this.xCoord;
    }
    if (xVelocity < 0) {
      if (animatedX < this.xCoord * (-1))
        return this.xCoord * (-1);
      if (animatedX < 0)
        return this.xCoord * (-1);
      if (animatedX > 0)
        return 0
    }
    if (xVelocity === 0) {
      if (this.state.resideState === 0) {
        if (xTouchLocation > CENTER)
          return this.xCoord * (-1);
        else
          return this.xCoord
      }
      else
        return 0
    }
    return 0;
  }
  _stateHelper = (animatedX, xVelocity, xTouchLocation) => {
    let resideState = this._helper(animatedX, xVelocity, xTouchLocation);
    this.setState({
      resideState
    });
    return resideState;
  }

  componentWillMount = () => {
    this.animatedValue = new Animated.ValueXY();
    this.animatedValue.x.addListener(v => { this.state.animatedValueX = v.value });
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.animatedValue.setOffset({ x: this.state.animatedValueX });
        this.animatedValue.setValue({ x: 0, y: 0 }); //Initial value
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.animatedValue.x, vx: this.state.animatedVelocity }
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        Animated.sequence([
          Animated.spring(this.animatedValue.x, {
            velocity: gestureState.vx,
            overshootClamping: true,
            toValue: this._stateHelper(parseInt(this.state.animatedValueX), parseFloat(gestureState.vx), parseFloat(gestureState.x0)),
            useNativeDriver: true,
            easing: Easing.linear
          })
        ]).start()
        this.animatedValue.flattenOffset();
        if (this.props.onResideStateChange)
          this.props.onResideStateChange(this._stateHelper(parseInt(this.state.animatedValueX), parseFloat(gestureState.vx), parseFloat(gestureState.x0)) / (this.props.xCoord || 300))
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });

    Dimensions.addEventListener("change", this.handler);
  };
  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.handler);
    this.animatedValue.x.removeAllListeners();
  }
}

ResideMenu.propTypes = {
  HiddenComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  VisibleComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onResideStateChange: PropTypes.func,
  xCoord: PropTypes.number
}

ResideMenu.defaultProps = {
  onResideStateChange: null,
  xCoord: 300
}