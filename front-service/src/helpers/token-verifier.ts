import Cookies from 'js-cookie';

const isElectron = (): boolean => /Electron/.test(navigator.userAgent);

export const storeToken = (token: string): void => {
  if (isElectron()) {
    localStorage.setItem('token', token);
    const now = new Date();
    const expiration = new Date(now.getTime() + (1 * 86400000)); // Expire après 1 jour
    localStorage.setItem('token-expiration', expiration.toString());
  } else Cookies.set("token", token, { expires: 1 });
  
};

export const getToken = (): string | null => {
  if (isElectron()) {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('token-expiration');

    if (!token || !expiration) {
      return null;
    }

    const now = new Date();
    const expirationDate = new Date(expiration);

    if (now > expirationDate) {
      localStorage.removeItem('token');
      localStorage.removeItem('token-expiration');
      return null;
    }

    return token;
  } else return Cookies.get("token") || null;
  
};

export const removeToken = (): void => {
  if (isElectron()) {
    localStorage.removeItem('token');
    localStorage.removeItem('token-expiration');
  } else Cookies.remove("token");
  
};
