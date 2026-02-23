const base =
  import.meta.env.MODE === 'production' ? '' : 'http://localhost:8080';

const backendFetch = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: 'include',
  });
  return await response.json();
};


export default backendFetch;