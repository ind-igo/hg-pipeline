const {Command, flags} = require('@oclif/command')
const ChannelUtils = require("../lib/ChannelUtils")

class ChannelList extends Command {
  async run() {
    const {flags} = this.parse(ChannelList)
    const channelId = flags.channel
    console.log(channelId)
    const playlistId = await ChannelUtils.GetPlaylistId(channelId)
    console.log(playlistId)
    const videoIdList = await ChannelUtils.GetChannelVideoIds(playlistId)

    console.log(videoIdList)
    this.log(data)
  }
}

ChannelList.description = `Pulls all video IDs from channel`

ChannelList.flags = {
  channel: flags.string({char: 'c', description: 'Channel ID'})
}

module.exports = ChannelList