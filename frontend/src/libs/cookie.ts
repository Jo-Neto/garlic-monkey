import Cookies from 'js-cookie';

export class Cookie {
  async setCookie(cookie: string, value: string) {
    Cookies.remove(cookie);
    Cookies.set(cookie, value);
  }

  async getCookie(cookie: string) {
    const sessionCookie = Cookies.get(cookie);
    return sessionCookie;
  }

  async eraseCookies(value: string) {
    Cookies.remove(value);
  }

  async ObjectToCookies(obj: any) {
    Object.keys(obj).forEach((key) => {
      this.setCookie(key, obj[key]);
    });
  }
}

const cookie = new Cookie();
export { cookie };
