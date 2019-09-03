require('dotenv').config();
const { google } = require('googleapis');
const { YT_API_KEY: auth } = process.env;
const youtube = google.youtube({ version: 'v3', auth });

// returns promise. Error handling occurs in middleware that calls this fetch function
async function fetchVideoData (videoId){
	const { data } = await youtube.videos.list({
		part: 'snippet,contentDetails',
		id: videoId,
		fields: 'items(snippet,contentDetails(caption))'
  });

  return { id: videoId, ...filterItemResponse(data.items) };
};

// helper function for formatting response
function filterItemResponse(items) {
	// destructure objects from first element of items array
  const { snippet } = items[0];
	const {
		publishedAt,
    channelId,
		title,
		description,
		thumbnails,
		channelTitle,
		tags,
		categoryId,
		liveBroadcastContent,
		defaultLanguage,
		defaultAudioLanguage
  } = snippet;

	return {
		publishedAt,
    channelId,
		title,
		description,
		thumbnails,
		channelTitle,
		tags,
		categoryId,
		liveBroadcastContent,
		defaultLanguage,
		defaultAudioLanguage,
	};
}

module.exports = fetchVideoData