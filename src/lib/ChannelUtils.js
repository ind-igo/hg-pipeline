require('dotenv').config();
const { google } = require('googleapis');
const { YT_API_KEY: auth } = process.env;

const youtube = google.youtube({ version: 'v3', auth })

// Returns playlist ID of all channel uploads
async function GetPlaylistId(channelId) {
	const { data } = await youtube.channels.list({
		part: 'contentDetails',
		id: channelId,
		fields: 'items(contentDetails/relatedPlaylists/uploads)'
	});
	return data.items[0].contentDetails.relatedPlaylists.uploads;
}

// Returns list of video IDs in playlist
async function GetChannelVideoIds(playlistId_) {
	let currentPageToken = '';
	let playlistItems = [];

	do {
		const { items, nextPageToken } = await fetchPlaylistItemPage(
			playlistId_,
			currentPageToken
		);
		playlistItems.push(...items);
		// nextPageToken
		// 	? (currentPageToken = nextPageToken)
    //   : (currentPageToken = '');
    currentPageToken = nextPageToken ? nextPageToken : '';
	} while (currentPageToken);

	return playlistItems;
};

const fetchPlaylistItemPage = (playlistId, pageToken = '', maxResults = 50) => {
	const { data } = youtube.playlistItems.list({
		part: 'contentDetails',
		maxResults,
		pageToken,
		playlistId,
		fields: 'nextPageToken,prevPageToken,pageInfo,items(contentDetails/videoId)'
	});
	const { items, nextPageToken } = data;
	return { items, nextPageToken };
};

module.exports = { GetPlaylistId, GetChannelVideoIds }