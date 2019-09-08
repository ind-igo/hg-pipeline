require('dotenv').config();
const { google } = require('googleapis');
const { YT_API_KEY: auth } = process.env;
const youtube = google.youtube({ version: 'v3', auth });

// returns promise. Error handling occurs in middleware that calls this fetch function
async function fetchVideoData (videoId){
	const { data } = await youtube.videos.list({
		part: 'snippet,contentDetails',
		id: videoId,
		fields: 'items(snippet,contentDetails(caption,duration))'
  });

  return { videoId: videoId, ...filterItemResponse(data.items) };
};

// helper function for formatting response
function filterItemResponse(items) {
	// destructure objects from first element of items array
  const { snippet, contentDetails } = items[0];
	const {
		publishedAt,
    channelId,
		title,
		description,
		thumbnails,
		channelTitle,
		tags,
		categoryId,
		defaultLanguage
  } = snippet;
  const { duration, caption } = contentDetails
  const captionsAdded = caption;
  const category = decodeCategory(categoryId)

	return {
		publishedAt,
    channelId,
		title,
		description,
		thumbnails,
		channelTitle,
		tags,
		category,
    defaultLanguage,
    duration,
    captionsAdded
	};
}

function decodeCategory(categoryId) {
	switch (categoryId) {
		case 1:
			return 'Film & Animation';
		case 2:
			return 'Autos & Vehicles';
		case 10:
			return 'Music';
		case 15:
			return 'Pets & Animals';
		case 17:
			return 'Sports';
		case 18:
			return 'Short Movies';
		case 19:
			return 'Travel & Events';
		case 20:
			return 'Gaming';
		case 21:
			return 'Videoblogging';
		case 22:
			return 'People & Blogs';
		case 23:
			return 'Comedy';
		case 24:
			return 'Entertainment';
		case 25:
			return 'News & Politics';
		case 26:
			return 'Howto & Style';
		case 27:
			return 'Education';
		case 28:
			return 'Science & Technology';
		case 29:
			return 'Nonprofits & Activism';
		case 30:
			return 'Movies';
		case 31:
			return 'Anime/Animation';
		case 32:
			return 'Action/Adventure';
		case 33:
			return 'Classics';
		case 34:
			return 'Comedy';
		case 35:
			return 'Documentary';
		case 36:
			return 'Drama';
		case 37:
			return 'Family';
		case 38:
			return 'Foreign';
		case 39:
			return 'Horror';
		case 40:
			return 'Sci-Fi/Fantasy';
		case 41:
			return 'Thriller';
		case 42:
			return 'Shorts';
		case 43:
			return 'Shows';
		case 44:
			return 'Trailers';
		default:
			return 'Undefined';
	}
}

module.exports = fetchVideoData