export class TodoModel {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;

  constructor(id: number, title: string, description: string, completed: boolean,
    createdAt: string, updatedAt: string, userId: number){
        this.id = id,
        this.title = title,
        this.description = description,
        this.completed = completed,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt,
        this.userId = userId
    }
}