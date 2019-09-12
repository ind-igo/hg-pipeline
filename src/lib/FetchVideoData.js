require('dotenv').config();
const { google } = require('googleapis');
const { YT_API_KEY: auth } = process.env;
const youtube = google.youtube({ version: 'v3', auth });

const categoryMap = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '18': 'Short Movies',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '21': 'Videoblogging',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': `Education`,
  '28': "Science & Technology",
  '29': 'Nonprofits & Activism',
  '30': 'Movies',
  '31': 'Anime/Animation',
  '32': 'Action/Adventure',
  '33': 'Classics',
  '34': 'Comedy',
  '35': 'Documentary',
  '36': 'Drama',
  '37': 'Family',
  '38': 'Foreign',
  '39': 'Horror',
  '40': 'Sci-Fi/Fantasy',
  '41': 'Thriller',
  '42': 'Shorts',
  '43': 'Shows',
  '44': 'Trailers',
}

// returns promise. Error handling occurs in middleware that calls this fetch function
async function FetchVideoData (videoId){
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
  const userCaptions = caption
  const category = categoryMap[categoryId]

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
    userCaptions
	};
}

module.exports = FetchVideoData