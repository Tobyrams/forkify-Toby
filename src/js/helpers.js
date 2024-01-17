import { TIMEOUT_SEC } from './config';

/**
 * Creates a Promise that rejects with a timeout error after a specified duration.
 *
 * @param {number} s - The timeout duration in seconds.
 * @returns {Promise} - A Promise that rejects with a timeout error.
 */
const timeout = function (s) {
  // Create and return a new Promise
  return new Promise(function (_, reject) {
    // Set up a timeout using setTimeout
    setTimeout(function () {
      // Reject the Promise with a timeout error after the specified duration
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000); // Convert seconds to milliseconds for setTimeout
  });
};

/**
 * Performs a GET request to the specified URL and returns the parsed JSON response.
 * @param {string} url - The URL to fetch JSON data from.
 * @returns {Promise<object>} A Promise that resolves to the parsed JSON data.
 * @throws {Error} If the response status is NOT OK, an error is thrown with the error message and status.
 */
export const getJSON = async function (url) {
  try {
    // Fetch data from the provided URL
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // Parse the JSON data from the response
    const data = await res.json();
    // If the response status is not ok (fetch failed), throw an error with details
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Return the parsed JSON data
    return data;
  } catch (err) {
    // Handle errors by showing an alert with the error message
    throw err;
  }
};

/**
 * Send JSON data to a specified URL using the fetch API.
 *
 * @param {*} url - The URL to send the JSON data to.
 * @param {*} uploadData - The JSON data to be sent.
 * @returns {*} - The response data obtained from the server.
 */
export const sendJSON = async function (url, uploadData) {
  try {
    // Use the fetch API to send a POST request with JSON data
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // Use Promise.race to handle a timeout for the fetch request
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // Parse the JSON data from the response
    const data = await res.json();

    // If the response status is not ok (fetch failed), throw an error with details
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // Re-throw the error for handling in the calling code
  }
};
