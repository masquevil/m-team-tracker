import { getMTeamTorrentDownloadLink, searchMTeamTorrents } from ':apis/mTeam';
import { downloadFile } from ':utils/download';
import { isEndTimeGreaterThanTwoDays } from ':utils/time';

(async () => {
  const torrents = await searchMTeamTorrents(1, 30);

  const freeTorrents = torrents.filter(
    (torrent) =>
      torrent.status.toppingLevel === '1' &&
      torrent.status.discount !== 'FREE' &&
      isEndTimeGreaterThanTwoDays(torrent.status.toppingEndTime),
  );

  for (const torrent of freeTorrents) {
    console.log('download torrent:', torrent.name);
    const torrentDownloadUrl = await getMTeamTorrentDownloadLink(torrent.id);
    const fileName = `${torrent.id}.torrent`;
    const { downloadStatus } = await downloadFile(torrentDownloadUrl, fileName);
    console.log('status:', downloadStatus);
  }
})();
