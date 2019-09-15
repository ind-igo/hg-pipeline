const fs = require('fs')
const {Command, flags} = require('@oclif/command')
const DataFetcher = require('../lib/DataFetcher')
const Transcriptor = require('../lib/Transcriptor')
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

    // For -c and -e option
    if (flags.channel && flags.export) {
      const channelId = flags.channel
      const filename = flags.export

      // IDK IF THIS WORKS
      let bracket = fs.exists(`${filename}.json`) ? '[\n' : ''
      let seperator = fs.exists(`${filename}.json`) ? ',' : ''

      // Setup stream output file
      const output = fs.createWriteStream(`${filename}.json`)
      output.write('[\n')

      // Seperator is null until initial object is inserted. Then change
      // to comma. This is to ensure proper JSON array format.
      let seperator = ''

      // Get array of video IDs for channel "Uploads" playlist
      const playlistId = await ChannelUtils.GetPlaylistId(channelId)
      const videoIdArray = await ChannelUtils.GetChannelVideoIds(playlistId)

      // Assemble video data into object and write to output file stream
      for (const element of videoIdArray) {
        const transcript = await Transcriptor(element)

        if (!transcript) {
          console.log("No transcript available, skipping...")
          continue
        } else {
          let videoData = await DataFetcher(element)

          // If API quota is reached, stop
          if (!videoData)
            break

          // Omit any music videos or performances
          if(videoData.category === 'Music') {
            console.log("Video is music video, skipping...")
            continue
          }

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

    // For -c and -i option, when you have a JSON file partially
    //  finished and want to continue.
    if(flags.channel && flags.append) {
      const importedFile = flags.append
      const channelId = flags.channel

      // Need to read last object in file and use that to find where I
      // stopped in the channel list
    }
  }
}

VideoData.description = `Gets Youtube video data for a single video or a whole channel's videos. Outputs a json file`

VideoData.flags = {
  video: flags.string({char: 'v', description: 'Video ID'}),
  channel: flags.string({char: 'c', description: 'Channel ID'}),
  export: flags.string({char: 'e', description: 'Export to JSON. Enter desired file name.'}),
  channel: flags.string({char: 'a', description: 'Append to JSON. Checks from last element and continues as far as possible.'})
}

module.exports = VideoData