import { getMTeamTorrentDownloadLink, searchMTeamTorrents } from ":apis/mTeam";
import { Minute } from ":utils/constants";
import { createDownloadDirectory, downloadFile } from ":utils/download";
import {
  isEndTimeGreaterThanTwoDays,
  isEndTimeGreaterThanOneDays,
} from ":utils/time";

async function run() {
  await createDownloadDirectory();
  const torrents = await searchMTeamTorrents(1, 50);

  const freeTorrents = torrents.filter(
    (torrent) =>
      // case 1: topping
      (torrent.status.toppingLevel === "1" &&
        torrent.status.discount !== "FREE" &&
        isEndTimeGreaterThanTwoDays(torrent.status.toppingEndTime)) ||
      // case 2: discount
      (torrent.status.discount === "FREE" &&
        +torrent.status.leechers > +torrent.status.seeders &&
        isEndTimeGreaterThanOneDays(torrent.status.discountEndTime))
  );

  console.log("free torrents:", freeTorrents.length);

  for (const torrent of freeTorrents) {
    console.log("download torrent:", torrent.id, torrent.name);
    const torrentDownloadUrl = await getMTeamTorrentDownloadLink(torrent.id);
    const fileName = `${torrent.id}.torrent`;
    const { downloadStatus } = await downloadFile(torrentDownloadUrl, fileName);
    console.log("status:", downloadStatus);
  }
}

(async () => {
  await run();

  if (process.env.NODE_ENV === "production") {
    setInterval(() => {
      run();
    }, Minute * 5);
  }
})();
