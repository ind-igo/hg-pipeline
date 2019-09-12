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
    if (flags.channel && flags.export) {
      const channelId = flags.channel
      const filename = flags.export

      // Setup stream output file
      const output = fs.createWriteStream(`${filename}.json`)
      output.write('[\n')
      let seperator = ''

      // Get array of video IDs for channel
      const playlistId = await ChannelUtils.GetPlaylistId(channelId)
      const videoIdArray = await ChannelUtils.GetChannelVideoIds(playlistId)

      //completeChannelData = []
      // Assemble video data into object and write to output file stream
      for (const element of videoIdArray) {
        const transcript = await Transcriptor(element)

        if (!transcript) {
          console.log("No transcript available, skipping...")
          continue
        } else {
          let videoData = await DataFetcher(element)
          videoData = { ...videoData, transcript }

          output.write(seperator + JSON.stringify(videoData, null, 2))
          if(!seperator)
            seperator = ",\n"

          console.log(`${videoData.title} has been transcribed!`)
        }
      }
      output.write('\n]')

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