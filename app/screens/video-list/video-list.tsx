import * as React from "react"
import {Image, ImageStyle, SafeAreaView, TextStyle, View, ViewStyle} from "react-native"
import {ParamListBase} from "@react-navigation/native"
import {NativeStackNavigationProp} from "react-native-screens/native-stack"
import {BulletItem, Header, Text, Screen, Wallpaper, Button} from "../../components"
import {color, spacing} from "../../theme"

export const heart = require("./heart.png")

const FULL: ViewStyle = {flex: 1}
const CONTAINER: ViewStyle = {backgroundColor: color.transparent, paddingHorizontal: spacing[4]}
const BOLD: TextStyle = {fontWeight: "bold"}
const HEADER: TextStyle = {paddingTop: spacing[3], paddingBottom: spacing[5] - 1, paddingHorizontal: 0}
const HEADER_TITLE: TextStyle = {
    ...BOLD,
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    letterSpacing: 1.5,
}
const TITLE: TextStyle = {
    ...BOLD,
    fontSize: 28,
    lineHeight: 38,
    textAlign: "center",
    marginBottom: spacing[5],
}
const TAGLINE: TextStyle = {
    color: "#BAB6C8",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing[4] + spacing[1],
}
const LOVE_WRAPPER: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: spacing[3],
    flexWrap: "wrap"
}
const LOVE: TextStyle = {color: "#BAB6C8", fontSize: 15, lineHeight: 22}
const HEART: ImageStyle = {marginHorizontal: spacing[2], width: 10, height: 10, resizeMode: "contain"}
const BUTTON: ViewStyle = {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: "#5D2555",
    width: "90%",
    alignSelf: "center"
}
const BUTTON_TEXT: TextStyle = {
    color: color.palette.white,
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: 13,
    letterSpacing: 2,
    textTransform: "uppercase",
}

export interface DemoScreenProps {
    navigation: NativeStackNavigationProp<ParamListBase>
}

export const VideoListScreen: React.FunctionComponent<DemoScreenProps> = props => {
    const goBack = React.useMemo(() => () => props.navigation.goBack(), [props.navigation])
    let recorded = ["", "", "", ""];

    let videos = recorded.map((item, idx) => {
        const key = "video #" + idx
        return <BulletItem key={key} text={key}/>
    })

    return (
        <View style={FULL}>
            <Wallpaper/>
            <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
                <Header headerTx="videoListScreen.poweredBy"
                        leftIcon="back"
                        onLeftPress={goBack}
                        style={HEADER}
                        titleStyle={HEADER_TITLE}
                />
                <Text style={TITLE} preset="header" tx="videoListScreen.title"/>
                <Text style={TAGLINE} tx="videoListScreen.tagLine"/>
                {videos}
            </Screen>
            <SafeAreaView>
                <Button style={BUTTON} textStyle={BUTTON_TEXT} tx="common.back" onPress={goBack}/>
                <View style={LOVE_WRAPPER}>
                    <Text style={LOVE} text="Made with"/>
                    <Image source={heart} style={HEART}/>
                    <Text style={LOVE} text="by j2e"/>
                </View>
            </SafeAreaView>
        </View>
    )
}
