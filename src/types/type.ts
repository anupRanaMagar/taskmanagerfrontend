export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
