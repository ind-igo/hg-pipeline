const {Command, flags} = require('@oclif/command')

class Indexer extends Command {
  async run() {
    const {flags} = this.parse(ChannelList)
    const channelId = flags.channel
    const playlistId = await ChannelUtils.GetPlaylistId(channelId)
    const videoIdList = await ChannelUtils.GetChannelVideoIds(playlistId)

    console.log(videoIdList)
  }
}

Indexer.description = `Pulls all video IDs from channel`

Indexer.flags = {
  channel: flags.string({char: 'c', description: 'Channel ID'}),

}

module.exports = Indexer