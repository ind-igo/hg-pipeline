require('dotenv').config()
const { google } = require('googleapis')
const { YT_API_KEY: auth } = process.env

const youtube = google.youtube({ version: 'v3', auth })

// Returns playlist ID of all channel uploads
async function GetPlaylistId(channelId_) {
	const { data } = await youtube.channels.list({
		part: 'contentDetails',
		id: channelId_,
		fields: 'items(contentDetails/relatedPlaylists/uploads)'
	})
	return data.items[0].contentDetails.relatedPlaylists.uploads
}

// Returns list of video IDs in playlist
async function GetChannelVideoIds(playlistId_) {
	let currentPageToken = ''
	let playlistItems = []

	do {
		const { items, nextPageToken } = await FetchPlaylistItemPage(
			playlistId_,
			currentPageToken
    )

    for(element of items) {
      playlistItems.push(element.contentDetails.videoId)
    }
    currentPageToken = nextPageToken ? nextPageToken : ''
	} while (currentPageToken)

	return playlistItems
}

async function FetchPlaylistItemPage(playlistId, pageToken = '', maxResults = 50) {
	const { data } = await youtube.playlistItems.list({
		part: 'contentDetails',
		maxResults,
		pageToken,
		playlistId,
		fields: 'nextPageToken,prevPageToken,pageInfo,items(contentDetails/videoId)'
  })
	const { items, nextPageToken } = data
	return { items, nextPageToken }
};

module.exports = { GetPlaylistId, GetChannelVideoIds }