export const PUBLIC_SITE_URL = "https://our-wedding.narulabs.ca";

export const buildPersonalizedInvitationUrl = (token: string) => {
  const url = new URL("/", PUBLIC_SITE_URL);
  url.hash = new URLSearchParams({ i: token }).toString();
  return url.toString();
};
