# react-native-reside-menu

Add a cool full-screen reside menu to your react-native application. 
Implemented using pure JavaScript. Uses NativeDriver for better performance.

This JS implementation is taken from 
Android - [AndroidResideMenu](https://github.com/SpecialCyCi/AndroidResideMenu)
iOS - [iOS REsideMenu](https://github.com/romaonthego/RESideMenu)

## Installation
`npm i -S react-native-reside-menu`

![Example. Animations are smoother](https://media.giphy.com/media/6C4y5yExaTzRQev6uF/giphy.gif)


## Usage
```js
import  React, { Component } from  'react';
import  ResideMenu  from  'react-native-reside-menu';
import { View } from  'react-native';

export  default  class  App  extends  Component {
	render() {
		return (
			<ResideMenu
				onResideStateChange={(s) => { console.log(s) }}
				VisibleComponent={() =>  <View style={{ flex: 1,backgroundColor: '#444' }}  />} 								 
				HiddenComponent={() =>  <View style={{ flex: 1, backgroundColor: '#eee' }}  />}
			/>

		)
	}
}
```


## Props
| Props | description| type |isRequired  |defaultValue |
|--|--|--|--|--|
| VisibleComponent | The top component in the reside menu (two layer) stack | React Component | true | () =>  <View style={{ flex: 1,backgroundColor: '#444' }}  />  |
| HiddenComponent | The bottom component in the reside menu (two layer) stack. Hidden by the top layer before action.  | React Component | true | () =>  <View style={{ flex: 1, backgroundColor: '#eee' }}  />  |
| xCoord | A number which dictates how far away the reside menu is pushed, on the X Axis | number | false | 300 dp |
| onResideStateChange | call back to when the state changes. -1, 0, 1 for left center and right | function | false | null |
