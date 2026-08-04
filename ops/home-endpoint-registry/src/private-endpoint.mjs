export function isPrivateOrTailnetIPv4(hostname) {
  const octets = hostname.split(".");
  if (
    octets.length !== 4 ||
    octets.some(
      (octet) => !/^(?:0|[1-9][0-9]{0,2})$/u.test(octet) || Number(octet) > 255,
    )
  ) {
    return false;
  }

  const [first, second] = octets.map(Number);
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 100 && second >= 64 && second <= 127)
  );
}

export function isCanonicalPrivateOrTailnetUrl(value, parsed) {
  const prefix = `${parsed.protocol}//`;
  if (typeof value !== "string" || !value.startsWith(prefix)) return false;

  const authority = value.slice(prefix.length).split(/[/?#]/u, 1)[0];
  const portSeparator = authority.lastIndexOf(":");
  const rawHostname = portSeparator === -1 ? authority : authority.slice(0, portSeparator);
  return rawHostname === parsed.hostname && isPrivateOrTailnetIPv4(parsed.hostname);
}

export function legacyHttpNoticeIsExplicit(notice) {
  if (
    notice === null ||
    typeof notice !== "object" ||
    typeof notice.en !== "string" ||
    typeof notice.zh !== "string"
  ) {
    return false;
  }

  const english = notice.en.toLowerCase();
  const chinese = notice.zh;
  return (
    /\b(?:only|must|required|requires)\b/u.test(english) &&
    /\b(?:home|private network)\b/u.test(english) &&
    /\b(?:tailscale|tailnet)\b/u.test(english) &&
    /\bhttp\b/u.test(english) &&
    /\b(?:legacy|unencrypted|plaintext|cleartext|risk)\b/u.test(english) &&
    /(?:仅|只能|必须)/u.test(chinese) &&
    /(?:家庭|家中|内网|私有网络)/u.test(chinese) &&
    /(?:tailscale|tailnet)/iu.test(chinese) &&
    /http/iu.test(chinese) &&
    /(?:未加密|明文|风险|不安全)/u.test(chinese)
  );
}
