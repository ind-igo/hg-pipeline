require('dotenv').config();
const { YT_API_KEY } = process.env;
const { google } = require('googleapis');
const youtube = google.youtube({ version: 'v3', auth: YT_API_KEY });

exports.fetchVideoData = async (videoId) => {
	const { data } = await youtube.videos.list({
		part: 'snippet,contentDetails',
		id: videoId,
		fields: 'items(snippet,contentDetails(caption,duration))'
	});

	return filter(data.items[0]);
};

function filter(videoItem) {
	delete videoItem.snippet.localized;
	return {
		...videoItem.snippet,
		...videoItem.contentDetails,
		category: decode(+videoItem.snippet.categoryId)
	};
}

function decode(categoryId) {
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
