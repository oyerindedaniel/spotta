import axios from "axios";
import qs from "qs";

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_OAUTH_REDIRECT,
} from "../config";

/**
 * Authorizes OAuth apps.
 *
 * For more information, see the GitHub documentation:
 * {@link https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps}
 */

interface GithubOauthToken {
  access_token: string;
  scope: string;
  token_type: string;
}

export const getGithubOauthToken = async ({
  code,
}: {
  code: string;
}): Promise<GithubOauthToken> => {
  const rootURl = "https://github.com/login/oauth/access_token";

  const options = {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: GITHUB_OAUTH_REDIRECT,
  };

  try {
    const { data } = await axios.post<GithubOauthToken>(
      rootURl,
      qs.stringify(options),
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    return data;
  } catch (err: any) {
    console.log("Failed to fetch github OAuth tokens");
    throw err;
  }
};

interface GithubUserResult {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export async function getGithubUser({
  access_token,
}: {
  access_token: string;
}): Promise<GithubUserResult> {
  try {
    const { data } = await axios.get<GithubUserResult>(
      `https://api.github.com/user`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return data;
  } catch (err: any) {
    console.log(err);
    throw err;
  }
}
