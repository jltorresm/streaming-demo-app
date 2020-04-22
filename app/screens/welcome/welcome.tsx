import * as React from "react"
import {View, Image, ViewStyle, TextStyle, ImageStyle, SafeAreaView} from "react-native"
import {ParamListBase} from "@react-navigation/native"
import {NativeStackNavigationProp} from "react-native-screens/native-stack"
import {Button, Header, Screen, Text, Wallpaper, Record} from "../../components"
import {color, spacing} from "../../theme"

const demoLogo = require("./awesome.png")

const FULL: ViewStyle = {flex: 1}
const CONTAINER: ViewStyle = {backgroundColor: color.transparent, paddingHorizontal: spacing[4]}
const TEXT: TextStyle = {color: color.palette.white, fontFamily: "Montserrat"}
const BOLD: TextStyle = {fontWeight: "bold"}
const HEADER: TextStyle = {paddingTop: spacing[3], paddingBottom: spacing[4] + spacing[1], paddingHorizontal: 0}
const HEADER_TITLE: TextStyle = {
    ...TEXT, ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
}
const TITLE: TextStyle = {...TEXT, ...BOLD, fontSize: 28, lineHeight: 38, textAlign: "center"}
const LOGO: ImageStyle = {alignSelf: "center", maxHeight: 150, resizeMode: "contain"}
const CONTENT: TextStyle = {
    ...TEXT,
    color: "#BAB6C8",
    fontSize: 20,
    lineHeight: 22,
    marginBottom: spacing[5],
    alignSelf: "center",
}
const BUTTON: ViewStyle = {paddingVertical: spacing[4], paddingHorizontal: spacing[4], backgroundColor: "#5D2555"}
const BUTTON_TEXT: TextStyle = {...TEXT, ...BOLD, fontSize: 13, letterSpacing: 2, textTransform: "uppercase"}
const FOOTER: ViewStyle = {backgroundColor: "#20162D"}
const FOOTER_CONTENT: ViewStyle = {paddingVertical: spacing[4], paddingHorizontal: spacing[4]}

const VIDEO_PREVIEW: ViewStyle = {height: 256, width: 144, alignSelf: "center", marginTop: 5}

export interface WelcomeScreenProps {
    navigation: NativeStackNavigationProp<ParamListBase>
}

export const WelcomeScreen: React.FunctionComponent<WelcomeScreenProps> = props => {
    const nextScreen = React.useMemo(() => () => props.navigation.navigate("videoList"), [
        props.navigation,
    ])

    return (
        <View style={FULL}>
            <Wallpaper/>
            <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
                <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE}/>
                <Text style={TITLE} text="This is the in-app recording demo!"/>
                <Image source={demoLogo} style={LOGO}/>
                <Text style={CONTENT}>First we need to capture some video</Text>
                <Record
                    previewStyle={VIDEO_PREVIEW}
                    buttonStyle={BUTTON}
                    textStyle={BUTTON_TEXT}
                    tx={"welcomeScreen.actions.record"}
                    stopTx={"welcomeScreen.actions.stopRecording"}
                    processingTx={"welcomeScreen.actions.processing"}
                />
            </Screen>
            <SafeAreaView style={FOOTER}>
                <View style={FOOTER_CONTENT}>
                    <Button style={BUTTON} textStyle={BUTTON_TEXT} tx="welcomeScreen.actions.videoList"
                            onPress={nextScreen}/>
                </View>
            </SafeAreaView>
        </View>
    )
}
