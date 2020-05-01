import * as React from "react"
import {View, ViewStyle} from "react-native"
import {RNCamera} from "react-native-camera"
import {Button, TextField} from "../"
import {RecordProps} from "./record.props"
import {flatten, mergeAll} from "ramda";
import {previewPresets} from "./record.presets";
import {color, spacing} from "../../theme";

const {API_URL} = require("../../config/env");

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
    const VIEW_STYLE = mergeAll(flatten([previewPresets[preset] || previewPresets.fullscreen, previewStyleOverride]))
    const CONTROLS_STYLE: ViewStyle = {marginTop: spacing[4], flexDirection: "row", justifyContent: "space-evenly"};
    const controlBase: ViewStyle = {backgroundColor: color.palette.lightGrey, borderRadius: 50};
    const CONTROL_STYLE: ViewStyle = mergeAll(flatten([buttonStyleOverride, controlBase]));

    // Prepare the necessary actions to manage the camera
    const [recording, isRecording] = React.useState(false);
    const [processing, isProcessing] = React.useState(false);
    const [videoName, setVideoName] = React.useState("");
    const [frontCamera, isFrontCamera] = React.useState(false);
    const [audioEnabled, isAudioEnabled] = React.useState(true);
    const camera = React.useRef(null)

    async function startRecording() {
        isRecording(true)

        // default to mp4 for android as codec is not set
        const {uri, codec = "mp4"} = await camera.current.recordAsync();
        isRecording(false)
        isProcessing(true)

        // Send the video to our API
        const type = "video/" + codec.toString()
        const data = new FormData();
        data.append("video", {name: videoName, type, uri});
        try {
            await fetch(API_URL + "/video", {method: "post", body: data});
        } catch (e) {
            console.log("===ERROR===", e);
        }

        setVideoName("");
        isProcessing(false)
    }

    function stopRecording() {
        camera.current.stopRecording();
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
            <TextField
                value={videoName}
                onChangeText={text => setVideoName(text)}
                placeholder="give the video a name before recording..."
            />
            {button}
            <RNCamera
                ref={camera}
                style={VIEW_STYLE}
                type={frontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                captureAudio={audioEnabled}
            />
            <View style={CONTROLS_STYLE}>
                <Button style={CONTROL_STYLE} textStyle={textStyleOverride} text={"Toggle Camera"}
                        onPress={() => isFrontCamera(!frontCamera)}/>
                <Button style={CONTROL_STYLE} textStyle={textStyleOverride}
                        text={audioEnabled ? "Disable Audio" : "Enable Audio"}
                        onPress={() => isAudioEnabled(!audioEnabled)}/>
            </View>
        </View>
    );
}
