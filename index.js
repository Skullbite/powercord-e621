const { Plugin } = require('powercord/entities')
const { get } = require('powercord/http')

module.exports = class e621 extends Plugin {
    startPlugin() {
        const userAgent = this.settings.get("headers", "Powercord/1.0 (<e621username>)")
        const nsfw = this.settings.get("nsfw", false)
        const blacklistedTags = this.settings.get("blacklistedTags", "")
        powercord.api.settings.registerSettings("e621", {
            category: this.entityID,
            label: "e621",
            render: require("./Settings.jsx"),
        })
        powercord.api.commands.registerCommand({
            command: "e621",
            aliases: ["e6"], 
            description: "Gets images from e621",
            usage: "{tags}",
            async executor(args) {
                if (!args.length) {
                  return {
                    send: false,
                    result: `Invalid usage! Valid Usage: \`${this.usage.replace(
                      "{tags}",
                      powercord.api.commands.prefix + this.command + " <tags>"
                    )}\``,
                  }
                }
                if (userAgent === "Powercord/1.0 (<e621username>)") {
                    return {
                        send: false,
                        result: "To get posts, you need to set a proper User-Agent in the settings."
                    }
                }
                let p = await getPost(args)
                if (!p.posts.length) {
                    return {
                        send: false,
                        result: "No posts found. *Maybe you typed a tag in wrong?*"
                    }
                } 
                const post = p.posts[0]
                async function getPost(tags) {
                    nsfw ? tags.push("rating:s") : {}
                    return await get(`https://${nsfw ? "e621" : "e926"}.net/posts.json?tags=${tags.join('%20')}`)
                    .set("User-Agent", userAgent)
                    .then(r => {return r.body})
                }
                
                /* const embed = {
                    type: 'rich',
                    title: `#${post.id}: ${post.tags.artist.join(", ")}`,
                    url: `https://${nsfw ? "e621" : "e926"}.net/posts/${post.id}`,
                    image: post.file.url,
                    footer: {
                        text: `Score: ${post.score.total} | Rating: ${post.rating.replace("e", "Explicit").replace("q", "Questionable").replace("s", "Safe")}`
                    }
                } */
                
                // let send = `\`\`\`diff\nRequest Debug\n- Blacklisted Tags Applied: ${blTags.length}\n- NSFW? On\n- Extra Tags: \`\`\`\n`
                let send = `> **Post ID:** ${post.id}\n> **Rating:** ${post.rating.replace("e", "Explicit").replace("s", "Safe").replace("q", "Questionable")}\n> **Post URL:** <https://${nsfw ? "e621" : "e926"}.net/posts/${post.id}>\n> **Image:** ${post.file.url}\n> **Score:** ${post.score.total}`
                
                return {
                    send: false,
                    result: send
                }
            }
        })
    }
    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("e621")
        powercord.api.settings.unregisterSettings("e621")
    }
    
}
