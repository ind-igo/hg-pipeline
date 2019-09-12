
const getSubtitles = require('youtube-captions-scraper').getSubtitles;

async function FetchTranscript(videoId) {
  let transcript;
  try {
    let captions = await getSubtitles({ videoID: videoId, lang: 'en' });
    transcript = CreateTranscript(captions)
  } catch {
    transcript = ""
  }

  return transcript
}

function CreateTranscript(captionTrack){
	if (!captionTrack.length) return '';

	return captionTrack
		.map((element) => element.text)
		.join(' ')
		.replace(/\n/gm, ' ')
		.trim();
}

module.exports = FetchTranscript