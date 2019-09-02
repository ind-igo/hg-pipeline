const {Command, flags} = require('@oclif/command')
const fetcher = require('../lib/FetchVideoData')
const transcriptor = require('../lib/FetchTranscript')

class VideoData extends Command {
  async run() {
    const {flags} = this.parse(VideoData)
    const videoId = flags.video
    let data = await fetcher(videoId)
    data["transcript"] = await transcriptor(videoId)

    if (flags.export) {
    }
    this.log(data)
  }
}

VideoData.description = `Gets Youtube video data for a single video. Outputs a json file`

VideoData.flags = {
  video: flags.string({char: 'v', description: 'List video ID'}),
  export: flags.string({char: 'e', description: 'Export to JSON'})
}

module.exports = VideoData