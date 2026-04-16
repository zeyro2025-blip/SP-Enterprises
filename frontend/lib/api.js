const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

const withAuth = (token, extraHeaders = {}) => ({
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extraHeaders
});

export const api = {
  get: (path, token) =>
    request(path, {
      headers: withAuth(token),
      cache: "no-store"
    }),
  post: (path, body, token) =>
    request(path, {
      method: "POST",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(body)
    }),
  put: (path, body, token) =>
    request(path, {
      method: "PUT",
      headers: withAuth(token, { "Content-Type": "application/json" }),
      body: JSON.stringify(body)
    }),
  delete: (path, token) =>
    request(path, {
      method: "DELETE",
      headers: withAuth(token)
    }),
  postForm: (path, body, token) =>
    request(path, {
      method: "POST",
      headers: withAuth(token),
      body
    }),
  putForm: (path, body, token) =>
    request(path, {
      method: "PUT",
      headers: withAuth(token),
      body
    })
};
