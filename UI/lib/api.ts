const API_BASE = "http://localhost:8000";

export interface Persona {
  bot_id: string;
  name: string;
  persona: string;
}

export interface MatchedBot {
  bot_id: string;
  name: string;
  similarity: number;
  label: string;
}

export interface GeneratePostResponse {
  mode: string;
  bot_id: string;
  topic: string;
  search_query: string;
  search_results: string;
  post_content: string;
  final_json: any;
}

export interface DefenseReplyResponse {
  mode: string;
  injection_detected: boolean;
  defense_reply: string;
}

export async function getPersonas(): Promise<Persona[]> {
  const response = await fetch(`${API_BASE}/personas`);
  const data = await response.json();
  return data.personas;
}

export async function routePost(postContent: string, threshold: number): Promise<MatchedBot[]> {
  const response = await fetch(`${API_BASE}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      post_content: postContent,
      threshold: threshold,
    }),
  });
  const data = await response.json();
  return data.matched_bots;
}

export async function generatePost(botId: string): Promise<GeneratePostResponse> {
  const response = await fetch(`${API_BASE}/generate-post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: botId,
    }),
  });
  const data = await response.json();
  return data;
}

export async function generateDefenseReply(
  parentPost: string,
  commentHistory: string,
  humanReply: string
): Promise<DefenseReplyResponse> {
  const response = await fetch(`${API_BASE}/defense-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent_post: parentPost,
      comment_history: commentHistory,
      human_reply: humanReply,
    }),
  });
  const data = await response.json();
  return data;
}