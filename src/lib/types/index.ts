export interface Company {
  id: string;
  name: string;
  user_id: string;
  created_at: Date;
  description: string | undefined;
  website_url: string;
  industry: string;
  goal: string;
  competion_urls: {
    id: string;
    url: string;
  }[];
  social_media_url?: {
    facebook?: string | undefined;
    twitter?: string | undefined;
    linkedin?: string | undefined;
    instagram?: string | undefined;
    youtube?: string | undefined;
  };
  master_keywords?: {
    id: string;
    keyword: string;
  }[];
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  deadline: Date;
  approved: boolean;
  assigned_to: string;
  created_at: Date;
}
export interface RecommendedTask {
  task_id: string;
  user_id: string;
  watchlist_id: string;
  domain: string;
  category: string;
  task: string;
  createdAt: Date;
  clarity: number;
}

export interface Keyword {
  id: string;
  keyword: string;
  volume: string;
  approve: boolean;
}

export interface Watchlist {
  id: string;
  user_id: string;
  title: string;
  keywords: Keyword[];
  createdAt: Date;
  tasks?: Task[];
}

export interface WatchlistReturned {
  watchlist: {
    id: string;
    user_id: string;
    title: string;
    createdAt: Date;
  };
  keywords: Keyword[];
  tasks: Task[];
}

export interface insertWatchlist {
  watchlist: {
    user_id: string;
    title: string;
    createdAt: Date;
  };
  keywords: Keyword[];
}
