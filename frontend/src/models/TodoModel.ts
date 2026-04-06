export class TodoModel {
  id: number;
  title: string;
  priority: number;
  description: string;
  complete: boolean;
  created_at?: string;
  user_id?: number;


  constructor(id: number, title: string, description: string, complete: boolean, priority: number,
    created_at: string, user_id: number){
        this.id = id,
        this.title = title,
        this.priority = priority,
        this.description = description,
        this.complete = complete,
        this.created_at = created_at,
        this.user_id = user_id
    }
}