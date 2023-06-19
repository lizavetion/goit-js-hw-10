const URL = 'https://api.thecatapi.com/v1/';

const options = {
  headers: {
    'x-api-key':
      'live_zFbvt2cuMYwtth15ONbOqPzyhqgCGVqA2s0h98m5D9nwATA7DDKbtGxIwmtsrwRY',
  },
};

function fetchBreeds(url) {
  return fetch(url).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}

function fetchCatByBreed(url) {
  return fetch(url, options).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}

export { URL, fetchBreeds, fetchCatByBreed };