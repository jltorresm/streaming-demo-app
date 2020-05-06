import * as React from "react"
import {View, ViewStyle} from "react-native"
import {RNCamera} from "react-native-camera"
import {Button, TextField} from "../"
import {RecordProps} from "./record.props"
import {flatten, mergeAll} from "ramda";
import {previewPresets} from "./record.presets";
import {color, spacing} from "../../theme";
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

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
    const CONTROL_STYLE: ViewStyle = mergeAll(flatten([controlBase, buttonStyleOverride]));
    const DISABLED_CONTROL_STYLE: ViewStyle = mergeAll(flatten([buttonStyleOverride, {opacity: 0.2}]));

    // Prepare the necessary actions to manage the camera
    const [recording, isRecording] = React.useState(false);
    const [processing, isProcessing] = React.useState(false);
    const [videoName, setVideoName] = React.useState("");
    const [frontCamera, isFrontCamera] = React.useState(false);
    const [audioEnabled, isAudioEnabled] = React.useState(true);
    const camera = React.useRef(null)

    async function startRecording() {
        isRecording(true)

        // Default to mp4 for android as codec is not set.
        const {uri, codec = "mp4"} = await camera.current.recordAsync();
        isRecording(false)
        isProcessing(true)

        try {
            //
            // Get the pre-signed url from our API server to upload the video to the storage server (S3).
            //
            let preSignedPostObjectResponse = await fetch(API_URL + "/upload", {method: "GET"});
            if (!preSignedPostObjectResponse.ok) {
                throw new Error("API error");
            }
            let preSignedPostObject = await preSignedPostObjectResponse.json();

            //
            // Fill-in the fields that come from the pre-built post object.
            //
            const data = new FormData();
            Object.keys(preSignedPostObject.formInputs).forEach(key => {
                const value = preSignedPostObject.formInputs[key]
                data.append(key, value);
            });

            //
            // Prepare the video to be sent over to the storage server and do the upload.
            //
            const type = "video/" + codec.toString()
            const videoUUID = uuidv4();
            const filename = videoUUID + "." + codec.toString();
            data.append("file", {name: filename, type, uri});
            const attributes = {
                method: preSignedPostObject.formAttributes.method,
                body: data,
                headers: {
                    'Content-Type': preSignedPostObject.formAttributes.enctype,
                },
            };

            console.log("Starting upload...\n\tVideo with UUID:" + videoUUID)
            let uploadResponse = await fetch(preSignedPostObject.formAttributes.action, attributes);
            if (!uploadResponse.ok) {
                console.log(await uploadResponse.text());
                throw new Error("API error");
            }
            console.log("Successfully uploaded...")

            //
            // Now sent the metadata to our API.
            //
            console.log("Saving metadata to API...\n\tVideo with UUID:" + videoUUID)
            let metadata = {name: videoName, uuid: videoUUID, type: type};
            await fetch(API_URL + "/upload", {
                method: "PUT",
                body: JSON.stringify(metadata),
                headers: {"Content-Type": "application/json"},
            });
            console.log("Successfully saved metadata...");
        } catch (e) {
            console.log("===ERROR===", e);
        }

        setVideoName("");
        isProcessing(false);
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

    const disableControls = recording || processing;
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
                <Button style={disableControls ? DISABLED_CONTROL_STYLE : CONTROL_STYLE}
                        textStyle={textStyleOverride} text={"Toggle Camera"}
                        disabled={disableControls}
                        onPress={() => isFrontCamera(!frontCamera)}/>
                <Button style={disableControls ? DISABLED_CONTROL_STYLE : CONTROL_STYLE}
                        textStyle={textStyleOverride}
                        disabled={disableControls}
                        text={audioEnabled ? "Disable Audio" : "Enable Audio"}
                        onPress={() => isAudioEnabled(!audioEnabled)}/>
            </View>
        </View>
    );
}
