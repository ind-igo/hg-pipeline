const {Command, flags} = require('@oclif/command')
const Fetcher = require('../lib/FetchVideoData')
const Transcriptor = require('../lib/FetchTranscript')
const ChannelUtils = require("../lib/ChannelUtils")

class VideoData extends Command {
  async run() {
    const {flags} = this.parse(VideoData)

    if (flags.video) {
      const videoId = flags.video;
      let data = await Fetcher(videoId);
      data.transcript = await Transcriptor(videoId);

      if (flags.export) {
      }
      this.log(data);
    } 

    if (flags.channel) {
      const channelId = flags.channel
      const playlistId = await ChannelUtils.GetPlaylistId(channelId)
      const videoIdArray = await ChannelUtils.GetChannelVideoIds(playlistId)

      let completeChannelData = []
      videoIdArray.forEach((item) => {
        let videoData = await Fetcher(item)
        videoData.transcript = await Transcriptor(item)

        completeChannelData.push(videoData)
      })

      this.log(completeChannelData)
    }
  }
}

VideoData.description = `Gets Youtube video data for a single video or a whole channel's videos. Outputs a json file`

VideoData.flags = {
  video: flags.string({char: 'v', description: 'Video ID'}),
  channel: flags.string({char: 'c', description: 'Channel ID'}),
  export: flags.string({char: 'e', description: 'Export to JSON'})
}

module.exports = VideoData