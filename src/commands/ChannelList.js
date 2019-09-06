const {Command, flags} = require('@oclif/command')
const ChannelUtils = require("../lib/ChannelUtils")

class ChannelList extends Command {
  async run() {
    const {flags} = this.parse(ChannelList)
    const channelId = flags.channel
    const playlistId = await ChannelUtils.GetPlaylistId(channelId)
    const videoIdList = await ChannelUtils.GetChannelVideoIds(playlistId)

    console.log(videoIdList)
  }
}

ChannelList.description = `Pulls all video IDs from channel`

ChannelList.flags = {
  channel: flags.string({char: 'c', description: 'Channel ID'}),

}

module.exports = ChannelList