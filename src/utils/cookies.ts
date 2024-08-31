export function setCookie(name: string, value: string, days: number) {
  if (typeof document !== 'undefined') {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = `${name}=${value}; ${expires}; path=/`;
  }
}
export function getCookie(name: string): string | null {
  if (typeof document !== 'undefined') {
      const nameEQ = name + "=";
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          if (cookie.indexOf(nameEQ) === 0) {
              return cookie.substring(nameEQ.length).replace(/^"|"$/g, '');
          }
      }
  }
  return null;
}


export function deleteCookie(name: string) {
  setCookie(name, "", -1);
}



// function handleLogin(token) {
//   setCookie("token", token, 1);
// }