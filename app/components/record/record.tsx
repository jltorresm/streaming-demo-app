import * as React from "react"
import {View} from "react-native"
import {RNCamera} from "react-native-camera"
import {Button} from "../"
import {RecordProps} from "./record.props"
import {flatten, mergeAll} from "ramda";
import {previewPresets} from "./record.presets";

export function Record(props: RecordProps) {
    // grab the props
    const {
        preset = "fullscreen",
        tx,
        stopTx,
        processingTx,
        text,
        previewStyle: previewStyleOverride,
        buttonStyle: buttonStyleOverride,
        textStyle: textStyleOverride,
    } = props

    // Calculated styles
    const viewStyle = mergeAll(flatten([previewPresets[preset] || previewPresets.fullscreen, previewStyleOverride]))

    // Prepare the necessary actions to manage the camera
    const [recording, isRecording] = React.useState(false);
    const [processing, isProcessing] = React.useState(false);

    let camera: RNCamera;

    async function startRecording() {
        isRecording(true)

        // default to mp4 for android as codec is not set
        const {uri, codec = "mp4"} = await camera.recordAsync();
        isRecording(false)
        isProcessing(true)

        console.log(uri, codec)

        // Do things here

        isProcessing(false)
    }

    function stopRecording() {
        camera.stopRecording();
    }

    // Prepare the different buttons we need for each recording state
    let button = (
        <Button onPress={startRecording} style={buttonStyleOverride} textStyle={textStyleOverride} tx={tx} text={text}/>
    );

    if (recording) {
        button = (
            <Button onPress={stopRecording} style={buttonStyleOverride} textStyle={textStyleOverride} tx={stopTx}/>
        );
    }

    if (processing) {
        button = (
            <Button disabled={true} style={buttonStyleOverride} textStyle={textStyleOverride} tx={processingTx}/>
        );
    }

    return (
        <View>
            {button}
            <RNCamera
                ref={ref => {
                    camera = ref;
                }}
                style={viewStyle}
                type={RNCamera.Constants.Type.front}
                flashMode={RNCamera.Constants.FlashMode.on}
            />
        </View>
    )
}
