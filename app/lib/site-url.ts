export const PUBLIC_SITE_URL = "https://our-wedding.narulabs.ca";

type PersonalizedInvitationUrlOptions = {
  autoMode?: boolean;
};

export const buildPersonalizedInvitationUrl = (
  token: string,
  { autoMode = false }: PersonalizedInvitationUrlOptions = {},
) => {
  const url = new URL(autoMode ? "/auto" : "/", PUBLIC_SITE_URL);
  url.hash = new URLSearchParams({ i: token }).toString();
  return url.toString();
};
