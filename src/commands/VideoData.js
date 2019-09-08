const fs = require('fs')
const {Command, flags} = require('@oclif/command')
const Fetcher = require('../lib/FetchVideoData')
const Transcriptor = require('../lib/FetchTranscript')
const ChannelUtils = require("../lib/ChannelUtils")

class VideoData extends Command {
  async run() {
    const {flags} = this.parse(VideoData)

    if (flags.video) {
      const videoId = flags.video
      let data = await Fetcher(videoId)
      data.transcript = await Transcriptor(videoId)
      this.log(data);
    } 

    if (flags.channel) {
      const channelId = flags.channel
      const playlistId = await ChannelUtils.GetPlaylistId(channelId)
      const videoIdArray = await ChannelUtils.GetChannelVideoIds(playlistId)

      let completeChannelData = []
      for (const item of videoIdArray) {
        let videoData = await Fetcher(item)
        videoData.transcript = await Transcriptor(item)
        console.log(`${videoData.title} has been transcribed!`)
        completeChannelData.push(videoData)
      }

      if (flags.export) {
        const filename = flags.export
        const channelData = JSON.stringify(completeChannelData, null, 2)

        fs.writeFile(`${filename}.json`, channelData, (err) => {
          if (err) throw err
          console.log(`File has been saved to ${filename}.json`)
        })
      }
      //this.log(completeChannelData)
    }
  }
}

VideoData.description = `Gets Youtube video data for a single video or a whole channel's videos. Outputs a json file`

VideoData.flags = {
  video: flags.string({char: 'v', description: 'Video ID'}),
  channel: flags.string({char: 'c', description: 'Channel ID'}),
  export: flags.string({char: 'e', description: 'Export to JSON. Enter desired file name.'})
}

module.exports = VideoData