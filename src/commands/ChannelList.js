const {Command, flags} = require('@oclif/command')
const ChannelUtils = require("../lib/ChannelUtils")

class ChannelList extends Command {
  async run() {
    const {flags} = this.parse(ChannelList)
    const channelId = flags.name
    const playlistId = await ChannelUtils.GetPlaylistId(channelId)
    VideoIdList = await ChannelUtils.GetChannelVideoIds(playlistId)

    this.log(data)
  }
}

ChannelList.description = `Pulls all video IDs from channel`

ChannelList.flags = {
  video: flags.string({char: 'c', description: 'Channel ID'})
}

module.exports = ChannelList