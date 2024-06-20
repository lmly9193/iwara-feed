import { Feed } from 'feed';

export type FeedRequest = {
  username: string;
  format?: 'atom' | 'rss' | 'json';
};

export type IwaraProfile = {
  user: IwaraUser;
  [key: string]: unknown;
};

export type IwaraUser = {
  id: string;
  name: string;
  username: string;
  [key: string]: unknown;
};

export type IwaraVideoSearch = {
  count: number;
  results: IwaraVideo[];
  [key: string]: unknown;
};

export type IwaraVideo = {
  id: string;
  title: string;
  thumbnail: number;
  file: {
    id: string;
    [key: string]: unknown;
  };
  user: IwaraUser;
  createdAt: string;
  [key: string]: unknown;
};

export interface IUserFactory {
  new ({ id, name, username }: IwaraUser): IUser;
  from(username: string): Promise<IUser>;
}

export interface IUser {
  id: string;
  name: string;
  username: string;
  video(): Promise<IwaraVideo[]>;
}

export interface IFeederFactory {
  new (user: IUser): IFeeder;
  create(user: IUser): Promise<IFeeder>;
}

export interface IFeeder {
  feed: Feed;
  import(videos: IwaraVideo[]): Promise<void>;
  add(video: IwaraVideo): void;
  rss(): string;
  atom(): string;
  json(): string;
}
