export const getCookie = (key) => {
  const cookies = document.cookie
    .split("; ")
    .map((cookie) => cookie.split("="))
    .reduce((acc, [k, v]) => {
      acc[k] = decodeURIComponent(v);
      return acc;
    }, {});

  return cookies[key] || null;
};

export const setCookie = (key, value) => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; expires=${expirationDate.toUTCString()}; path=/`;
};
