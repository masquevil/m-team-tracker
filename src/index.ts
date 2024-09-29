import { getMTeamTorrentDownloadLink, searchMTeamTorrents } from ':apis/mTeam';
import { Minute } from ':utils/constants';
import { createDownloadDirectory, downloadFile } from ':utils/download';
import { isEndTimeGreaterThanTwoDays } from ':utils/time';

async function run() {
  await createDownloadDirectory();
  const torrents = await searchMTeamTorrents(1, 50);

  const freeTorrents = torrents.filter(
    (torrent) =>
      torrent.status.toppingLevel === '1' &&
      torrent.status.discount !== 'FREE' &&
      isEndTimeGreaterThanTwoDays(torrent.status.toppingEndTime),
  );

  for (const torrent of freeTorrents) {
    console.log('download torrent:', torrent.id, torrent.name);
    const torrentDownloadUrl = await getMTeamTorrentDownloadLink(torrent.id);
    const fileName = `${torrent.id}.torrent`;
    const { downloadStatus } = await downloadFile(torrentDownloadUrl, fileName);
    console.log('status:', downloadStatus);
  }
}

(async () => {
  await run();

  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      run();
    }, Minute * 5);
  }
})();
