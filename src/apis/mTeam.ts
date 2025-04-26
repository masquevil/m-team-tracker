import FormData from "form-data";
import axios from ":utils/axios";
import { getMTeamAPIToken } from ":utils/misc";

export type MTeamTorrent = {
  id: string;
  name: string;
  status: {
    toppingLevel: "0" | "1";
    toppingEndTime: null | string;
    discount: "FREE" | "PERCENT_50";
    discountEndTime: null | string;
    seeders: string;
    leechers: string;
  };
  imageList: string[];
};

export async function searchMTeamTorrents(
  pageNumber: number,
  pageSize: number
): Promise<MTeamTorrent[]> {
  const adultRes = await axios.post(
    "https://api.m-team.io/api/torrent/search",
    {
      mode: "adult",
      pageNumber,
      pageSize,
      visible: 1,
      categories: [],
    },
    {
      headers: {
        "x-api-key": getMTeamAPIToken(),
      },
    }
  );
  const allRes = await axios.post(
    "https://api.m-team.io/api/torrent/search",
    {
      mode: "normal",
      pageNumber,
      pageSize,
      visible: 1,
      categories: [],
      discount: "FREE",
      sortField: "leechers",
      sortType: "desc",
    },
    {
      headers: {
        "x-api-key": getMTeamAPIToken(),
      },
    }
  );

  if (
    adultRes.status !== 200 ||
    adultRes.data.message !== "SUCCESS" ||
    allRes.status !== 200 ||
    allRes.data.message !== "SUCCESS"
  ) {
    throw new Error("Failed to fetch M-Team torrents");
  }

  const data = [...adultRes.data.data.data, ...allRes.data.data.data];

  // console.log(
  //   "\n\nsearch result:",
  //   data.map(
  //     ({
  //       id,
  //       name,
  //       smallDescr,
  //       status: {
  //         discount,
  //         discountEndTime,
  //         toppingLevel,
  //         toppingEndTime,
  //         seeders,
  //         leechers,
  //         mallSingleFree,
  //       },
  //     }) => ({
  //       id,
  //       name,
  //       smallDescr,
  //       status: {
  //         discount,
  //         discountEndTime,
  //         toppingLevel,
  //         toppingEndTime,
  //         seeders,
  //         leechers,
  //       },
  //       mallSingleFree,
  //     })
  //   )
  // );

  return data;
}

export async function getMTeamTorrentDownloadLink(
  torrentId: string
): Promise<string> {
  if (isNaN(Number(torrentId))) {
    throw new Error("Invalid torrent ID");
  }

  const formData = new FormData();
  formData.append("id", torrentId);

  const res = await axios.post(
    "https://api.m-team.cc/api/torrent/genDlToken",
    formData,
    {
      headers: {
        "x-api-key": getMTeamAPIToken(),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (res.status !== 200 || res.data.message !== "SUCCESS") {
    throw new Error("Failed to fetch M-Team torrent download link");
  }

  return res.data.data;
}
