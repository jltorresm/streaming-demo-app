import {ViewStyle, Dimensions} from "react-native"

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const previewPresets = {
  fullscreen: {height: Dimensions.get('window').height} as ViewStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof previewPresets
