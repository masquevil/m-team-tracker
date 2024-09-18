import { MTeamAPIToken } from './constants';

export function getMTeamAPIToken() {
  if (!MTeamAPIToken) {
    throw new Error('M-Team API token is not set');
  }

  return MTeamAPIToken;
}
