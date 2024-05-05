export const getGithubUrl = (from: string) => {
  const rootUrl = `https://github.com/login/oauth/authorize`;

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URL as string,
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
    allow_signup: "true",
    scope: ["(no scope)"].join(" "),
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
