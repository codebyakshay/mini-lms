export interface FreeAPIProduct {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
}

export interface FreeAPIUser {
  id: number;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface APIResponse<T> {
  status: number;
  message: string;
  data: {
    data: T[];
  };
}
