const fs = require('fs')
const {Command, flags} = require('@oclif/command')
const DataFetcher = require('../lib/FetchVideoData')
const Transcriptor = require('../lib/FetchTranscript')
const ChannelUtils = require("../lib/ChannelUtils")

class VideoData extends Command {
  async run() {
    const {flags} = this.parse(VideoData)

    // TODO: Change to get captionTrack and transcript, and call both functions here
    // For -v option
    if (flags.video) {
      const videoId = flags.video
      let data = await DataFetcher(videoId)
      data.transcript = await Transcriptor(videoId)
      this.log(data);
    } 

    // For -c option
    if (flags.channel) {
      const channelId = flags.channel
      const playlistId = await ChannelUtils.GetPlaylistId(channelId)
      const videoIdArray = await ChannelUtils.GetChannelVideoIds(playlistId)

      // TODO: Discard useless transcripts
      // Assemble all video data from channel in one object
      let completeChannelData = []
      for (const item of videoIdArray) {
        const transcript = await Transcriptor(item)
        if (transcript === "") {
          console.log("No transcript available, skipping...")
          continue
        } else {
          let videoData = await DataFetcher(item)
          videoData = { ...videoData, transcript }
          console.log(`${videoData.title} has been transcribed!`)
          completeChannelData.push(videoData)
        }
      }

      // if -e is available, export json to file
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