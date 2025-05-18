
export interface Message {
  text: string;
  isUser: boolean;
  proofs?: ChatReplyResponse['proof'];
}

export type ChatReplyResponse = {
  message: string;
  project_id: string;
  query: string;
  response: string;
  proof: {
    chunk_id: number;
    file_name: string;
    similarity_score: number;
  }[];
};

export type Project = {
  id: string;
  name: string;
};