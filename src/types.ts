import { Feed } from 'feed';

export interface FeedRequest {
  username: string;
  format?: 'atom' | 'rss' | 'json';
}

export interface IUserFactory {
  new ({ id, username, name }: IwaraUser): IUser;
  from(username: string): Promise<IUser>;
}

export interface IUser {
  id: string;
  name: string;
  username: string;
  video(): Promise<IwaraVideo[]>;
}

export interface IwaraProfile {
  user: IwaraUser;
}

export interface IwaraUser {
  id: string;
  name: string;
  username: string;
}

export interface IwaraVideoSearch {
  count: number;
  results: IwaraVideo[];
}

export interface IwaraVideo {
  id: string;
  title: string;
  user: IwaraUser;
  thumbnail: string;
  file: {
    id: string;
  };
  createdAt: string;
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
