import { useState, useEffect } from "react";
import { TodoModel } from "../../models/TodoModel";
import { useHistory } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Slidebar: React.FC<{ open: boolean; refresh: boolean }> = ({ open, refresh }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [todos, setTodos] = useState<TodoModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<any>(null);
  
  const history = useHistory();

  const formatTodoDate = (createdAt: string | any): string => {
    const date = new Date(createdAt);
    const today = new Date();


    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

            if (!token) {
                history.push("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/todos", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await response.json();
                setTodos(data);

            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

    fetchTodos();

    const handleClickOutside = () =>{
      setActiveIndex(null);
      if(window.innerWidth < 292)
        open = false;
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    }
  }, [refresh]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <p>{httpError}</p>;
  }

  return (
    <div
      className="border-end"
      style={{
        width: "300px",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }}
    >
      <div className="vh-100 d-flex flex-column">

        <div
          className="p-3 d-flex justify-content-between align-items-center border-bottom"
          style={{ height: 60 }}
        >
          <span className="fw-normal" style={{ fontSize: "22px" }}>
            Your todo
          </span>

          <Link to="/" className="btn btn-dark">
            <i className="bi bi-plus-lg"></i>
          </Link>

        </div>

        <div className="list-group list-group-flush overflow-auto flex-grow-1">
          {todos.map((todo, index) => (
            <Link
              key={todo.id}
              to={`/todos/${todo.id}`}
              className={`list-group-item list-group-item-action ${activeIndex === index ? "active" : ""
                }`}
              style={{ minHeight: 85 }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="d-flex justify-content-between">
                <strong>{todo.title} 
                  {todo.complete? <i className="bi bi-check-all"></i> : ""}
                </strong>

                <small>{formatTodoDate(todo.created_at)}</small>
              </div>
              <div className="small">{todo.description}</div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};