const { create: createPlaylist } = require('../../core/playlist')
const { db, logger, file } = require('../../core')
const { orderBy } = require('natural-orderby')
const _ = require('lodash')

async function main() {
  logger.info('loading streams...')
  await db.streams.load()
  let streams = await db.streams.find({})

  logger.info('sorting links...')
  streams = orderBy(
    streams,
    ['channel', s => (s.channel ? '' : s.title), 'url'],
    ['asc', 'asc', 'asc']
  )

  logger.info('saving...')
  const files = _.groupBy(streams, 'filepath')
  for (const filepath in files) {
    const playlist = createPlaylist(files[filepath], { public: false })
    await file.create(filepath, playlist.toString())
  }
}

main()
