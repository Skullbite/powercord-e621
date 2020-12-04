const { Modal } = require("powercord/components/modal")
const { FormTitle, Card, Text, Divider, Button, FormNotice } = require("powercord/components")
const { close } = require("powercord/modal")
const { React, getModule } = require("powercord/webpack")
const { clipboard } = require("electron")

const generateSources = (sources) => {
    let sauce = sources.map(link => <a href={ link }>{ link.split("/")[2] }</a>)
    return sauce.reduce((prev, curr) => [prev, ', ', curr]) 
}
module.exports = ({ post, nsfw }) => <Modal size={ Modal.Sizes.LARGE }>
    <Modal.Header>
        <FormTitle tag="h3">
                <b>
                    #{ post.id }{post.tags.artist.length ? ": " + post.tags.artist.join(", ") : ""}
                </b>
        </FormTitle>
        <Modal.CloseButton onClick={ close } />
    </Modal.Header>
    <Modal.Content>
        <div className="info">
            <Card id="card">
                <FormTitle tag="h4">POST INFO</FormTitle>
                <Divider/>
                <Text>
                    { post.rating === "e" ? <Text>Rating: <b style={{ color: "#e45f5f" }}>Explicit</b></Text> : post.rating === "q" ? <Text>Rating: <b style={{ color: "#ffe666" }}>Questionable</b></Text> : post.rating === "s" ? <Text>Rating: <b style={{ color: "#3e9e49" }}>Safe</b></Text> : <Text>???</Text> }
                    <span>Score: {post.score.total}</span>
                    { post.sources.length ? <Text>Sources: {generateSources(post.sources)}</Text> : ""}
                    <Text><i>Created @ {post.created_at}</i></Text>
                    
                </Text>
            </Card>
            { post.file.ext.match(/(png|jpg|gif|jpeg)/) ? <img id="e6Preview" src={ post.file.url }></img> : post.file.ext === "webm" ? <video id="e6Preview" width="320" height="240" controls><source src={ post.file.url }></source></video> : <Text style={{ color: "#e45f5f" }}>Can't preview this file.</Text> }
        </div>
        <FormTitle tag="h4">POST TAGS</FormTitle>
        { getModule(['parse', 'parseTopic'], false).defaultRules.codeBlock
            .react({ content: `+ General (${post.tags.general.length})${post.tags.general.length ? ": " + post.tags.general.join(", ") : ""}\n+ Species (${post.tags.species.length})${post.tags.species.length ? ": " + post.tags.species.join(", ") : ""}\n+ Characters (${post.tags.character.length})${post.tags.character.length ? ": " + post.tags.character.join(", ") : ""}\n+ Meta (${post.tags.meta.length})${post.tags.meta.length ? ": " + post.tags.meta.join(", ") : ""}`, lang: "diff" }, null, {}) }
    </Modal.Content>
    <Modal.Footer>
        <Button
            onClick={() => clipboard.writeText(post.file.url)}
            color={Button.Colors.TRANSPARENT}
        >
           Copy File URL
        </Button>
        <Button
            onClick={() => clipboard.writeText(`https://${nsfw ? "e621" : "e926"}.net/posts/${post.id}`)}
            color={Button.Colors.TRANSPARENT}
        >
            Copy Post URL
        </Button>
    </Modal.Footer>
</Modal>