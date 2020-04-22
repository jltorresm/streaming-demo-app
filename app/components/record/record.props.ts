import {ViewStyle, TextStyle, TouchableOpacityProps} from "react-native"
import {ButtonPresetNames} from "./record.presets"

export interface RecordProps extends TouchableOpacityProps {
    /**
     * Text which is looked up via i18n.
     */
    tx?: string
    stopTx?: string
    processingTx?: string

    /**
     * The text to display if not using `tx` or nested components.
     */
    text?: string

    /**
     * Styles override
     */
    previewStyle?: ViewStyle | ViewStyle[]
    buttonStyle?: ViewStyle | ViewStyle[]
    textStyle?: TextStyle | TextStyle[]

    /**
     * One of the different types of text presets.
     */
    preset?: ButtonPresetNames
}
