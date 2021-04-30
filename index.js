const { Plugin } = require("powercord/entities");
const { React } = require("powercord/webpack");
const { open } = require("powercord/modal");
const postComp = require("./post.jsx");
const { get } = require("powercord/http");

module.exports = class e621 extends Plugin {
	startPlugin() {
		var plugin = this;
		this.loadStylesheet("post.css");
		powercord.api.settings.registerSettings("e621", {
			category: this.entityID,
			label: "e621",
			render: require("./Settings.jsx")
		});
		powercord.api.commands.registerCommand({
			command: "e621",
			aliases: ["e6"],
			description: "Gets images from e621",
			usage: "{tags}",
			async executor(args) {
				if (!args.length) {
					return {
						send: false,
						result: `Invalid usage! Valid Usage: \`${this.usage.replace("{tags}", powercord.api.commands.prefix + this.command + " <tags>")}\``
					};
				}
				var userAgent = plugin.settings.get("headers", "Powercord/1.0 (<e621username>)");
				var nsfw = plugin.settings.get("nsfw", false);
				var sortingTag = plugin.settings.get("sortingTag", "off");
				var sendMethod = plugin.settings.get("sendMethod", "modal");
				var blacklistedTags = plugin.settings.get("blacklistedTags", "young feral");
				if (userAgent === "Powercord/1.0 (<e621username>)") {
					return {
						send: false,
						result: "To get posts, you need to set a proper User-Agent in the settings."
					};
				}
				let p = await getPost(args);
				if (!p.posts.length) {
					return {
						send: false,
						result: "No posts found. *Maybe you typed a tag in wrong?*"
					};
				}
				const post = p.posts[0];
				async function getPost(tags) {
					nsfw ? {} : tags.push("rating:s");
					blacklistedTags.split(" ").length ? blacklistedTags.split(" ").map((e) => tags.push("-" + e)) : {};
					if (sortingTag !== "off") tags.push(sortingTag);
					return await get(`https://${nsfw ? "e621" : "e926"}.net/posts.json?tags=${tags.join("%20")}`)
						.set("User-Agent", userAgent)
						.then((r) => {
							return { posts: [r.body.posts[Math.floor(Math.random() * r.body.posts.length)]] };
						});
				}

				switch (sendMethod) {
					case "modal":
						return open(() => React.createElement(postComp, { post: post, nsfw: nsfw }));
					case "embed":
						let embed = {
							type: "rich",
							title: `#${post.id}: ${post.tags.artist.join(", ")}`,
							url: `https://${nsfw ? "e621" : "e926"}.net/posts/${post.id}`,
							image: post.file.url,
							footer: {
								text: `Score: ${post.score.total} | Rating: ${post.rating.replace("e", "Explicit").replace("q", "Questionable").replace("s", "Safe")}`
							}
						};
						return {
							send: false,
							result: embed
						};
					case "message":
						return {
							send: false,
							result: `> **Post ID:** ${post.id}\n> **Rating:** ${post.rating.replace("e", "Explicit").replace("s", "Safe").replace("q", "Questionable")}\n> **Post URL:** <https://${nsfw ? "e621" : "e926"}.net/posts/${post.id}>\n> **Image:** ${post.file.url}\n> **Score:** ${post.score.total}`
						};
				}
			}
		});
	}
	pluginWillUnload() {
		powercord.api.commands.unregisterCommand("e621");
		powercord.api.settings.unregisterSettings("e621");
	}
};
