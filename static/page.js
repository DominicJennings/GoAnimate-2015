const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
                                        appCode: "go",
			                ctc: "go",
			                isEmbed: 1,
			                isLogin: "Y",
                                        userId: 2152,
			                m_mode: "school",
			                page: "",
			                siteId: "0",
			                tlang: "en_US",
			                ut: 60,
			                // options
			                bs: "adam",
			                themeId: "family",
			                // paths
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'cc.swf'
			};
			break;
		}

		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
			                appCode: "go",
			                ctc: "go",
			                isEmbed: 1,
			                isLogin: "Y",
                                        userId: 2152,
			                m_mode: "school",
			                page: "",
			                siteId: "0",
			                tlang: "en_US",
			                ut: 60,
			                // options
			                themeId: "family",
			                // paths
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'cc_browser.swf'
			};
			break;
		}

		case "/go_full": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
                                        tts_enabled: 1,
			                upl: 1,
			                hb: 1,
			                pts: 0,
			                credits: 100,
			                themeColor: "silver",
			                uisa: "Y",
			                ve: "Y",
			                isEmbed: 1,
			                isVideoRecord: 1,
		                        userId: 2152,
			                m_mode: "Y",
			                appCode: "go",
			                is_golite_preview: 0,
			                collab: 0,
			                ctc: "go",
					presaveId: presave,
			                goteam_draft_only: 0,
			                isLogin: "Y",
			                isWide: 1,
			                stutype: "tiny_studio",
			                tutorial: 1,
			                lid: 13,
			                movieLid: 0,
			                has_asset_bg: "0",
			                has_asset_char: "0",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
                                        gocoins: 100,
			                page: "",
			                retut: 0,
		        	        siteId: "0",
			                tray: "custom",
			                tlang: "en_US",
			                ut: 30,
					nextUrl: "/pages/html/list.html",
					tutorial: 1,
				},
				allowScriptAccess: "always",
			};
			break;
		}

		case "/player": {
			title = "Player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
			                userId: "2152",
			                lid: 13,
			                siteId: "0",
			                isEmbed: 1,
					thumbnailURL: "/movie_thumbs/${mId}.png",
					isEmbed: 1,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
