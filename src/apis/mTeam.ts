import FormData from 'form-data';
import axios from ':utils/axios';
import { MTeamAPIToken } from ':utils/constants';

export type MTeamTorrent = {
  id: string;
  name: string;
  status: {
    toppingLevel: '0' | '1';
    toppingEndTime: null | string;
    discount: 'FREE' | 'PERCENT_50';
    discountEndTime: null | string;
  };
  imageList: string[];
};

export async function searchMTeamTorrents(
  pageNumber: number,
  pageSize: number,
): Promise<MTeamTorrent[]> {
  const res = await axios.post(
    'https://api.m-team.io/api/torrent/search',
    {
      mode: 'adult',
      pageNumber,
      pageSize,
      visible: 1,
      categories: [],
    },
    {
      headers: {
        'x-api-key': MTeamAPIToken,
      },
    },
  );

  if (res.status !== 200 || res.data.message !== 'SUCCESS') {
    throw new Error('Failed to fetch M-Team torrents');
  }

  return res.data.data.data;
}

export async function getMTeamTorrentDownloadLink(torrentId: string): Promise<string> {
  if (isNaN(Number(torrentId))) {
    throw new Error('Invalid torrent ID');
  }

  const formData = new FormData();
  formData.append('id', torrentId);

  const res = await axios.post('https://api.m-team.cc/api/torrent/genDlToken', formData, {
    headers: {
      'x-api-key': MTeamAPIToken,
      'Content-Type': 'multipart/form-data',
    },
  });

  if (res.status !== 200 || res.data.message !== 'SUCCESS') {
    throw new Error('Failed to fetch M-Team torrent download link');
  }

  return res.data.data;
}
