declare namespace API {
  type Profile = {
    [key: string]: unknown;
    user: User;
  };

  type User = {
    [key: string]: unknown;
    id: string;
    name: string;
    username: string;
  };

  type Search = {
    [key: string]: unknown;
    count: number;
    results: Video[];
  };

  type Video = {
    [key: string]: unknown;
    id: string;
    title: string;
    thumbnail: number;
    file: {
      [key: string]: unknown;
      id: string;
    };
    user: User;
    createdAt: string;
  };
}
