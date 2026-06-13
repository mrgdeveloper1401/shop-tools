import Cookies from 'js-cookie';
export type IToken = {
  token: {
    access: string;
  };
  is_staff: boolean;
};

const getToken = (): IToken | undefined => {
  const cookies = Cookies.get('token');
  if (cookies) {
    return JSON.parse(cookies);
  }
};

export default getToken;
