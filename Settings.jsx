const { React, getModuleByDisplayName } = require("powercord/webpack")
const { SwitchItem, TextInput, RadioGroup } = require("powercord/components/settings")
const { AsyncComponent } = require("powercord/components")
const FormItem = AsyncComponent.from(getModuleByDisplayName("FormItem"))
const FormText = AsyncComponent.from(getModuleByDisplayName("FormText"))

module.exports = class Settings extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { opened: { main: false } }
    }
    render() {
        const { getSetting, toggleSetting, updateSetting } = this.props

        return (<div>
            <SwitchItem
            note="If this is off, requests will be sent to e926.net with the rating:s tag in every request."
            value={getSetting("nsfw", false)}
            onChange={() => toggleSetting("nsfw")}>
                NSFW 
            </SwitchItem>
            <TextInput
            note="Your E621 User-Agent. This is an example of how it should look: 'MyProject/1.0 (by username on e621)'"
            defaultValue={getSetting("headers", "Powercord/1.0 (<e621username>)")}
            onChange={v => updateSetting("headers", v)}>
                E621 User Agent
            </TextInput>
            <TextInput
            note="Put tags you don't want to see here, seperate them with a space. Don't worry about adding the - at the beginning."
            defaultValue={getSetting("blacklistedTags", "young feral")}>
                Blacklisted Tags
            </TextInput>
            <FormItem
            title="Sorting Tags">
                <FormText type="description">
                Some tags you can use to sort your posts.
                </FormText>
            </FormItem>
            <RadioGroup
            options={[
                { name: "Off", value: "off" },
                { name: "Get posts in a random order. (order:random)", value: "order:random" },
                { name: "Get the highest scored post. (order:score)", value: "order:score" }
            ]}
            onChange={o => updateSetting("sortingTag", o.value)}
            value={getSetting("sortingTag", "off")}>
            </RadioGroup>
            <FormItem
            title="Sending Method">
                <FormText type="description">
                A few ways you can view your post. Embed and Message cannot preview files.
                </FormText>
            </FormItem>
            <RadioGroup
            options={[
                { name: "Modal (Recommended)", value: "modal" },
                { name: "Embed", value: "embed" },
                { name: "Message", value: "message" }
            ]}
            onChange={o => updateSetting("sendMethod", o.value)}
            value={getSetting("sendMethod", "modal")}>
            </RadioGroup>

        </div>)
    }
}