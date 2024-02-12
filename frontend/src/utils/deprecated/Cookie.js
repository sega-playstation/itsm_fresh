export function getCookie(cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim(); // Remove leading and trailing whitespace

    if (c.indexOf(name) === 0) {
      const cookieValue = c.substring(name.length);
      return decodeURIComponent(cookieValue); // Decode the cookie value
    }
  }

  return null; // Return null to indicate that the cookie was not found
}
