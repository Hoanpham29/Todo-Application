import { useState, useEffect } from "react";
import { TodoModel } from "../../models/TodoModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useHistory } from "react-router-dom";
import { NewTodoForm } from "./components/NewTodoForm";
import { TodoItem } from "./components/TodoItem";

export const HomePage: React.FC<{
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    refresh: boolean;
}> = ({ setRefresh, refresh }) => {

    const [todos, setTodos] = useState<TodoModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    const history = useHistory();

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

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    history.push("/login");
                    return;
                }

                if (!response.ok) {
                    history.push("/login");
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
    }, [refresh, history]);


    const addTodo = (newTodo: TodoModel) => {
        setTodos(prev => [newTodo, ...prev]);
    };


    if (isLoading) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return <p className="text-danger">{httpError}</p>;
    }
    return (
        <div className='mt-5 container w-75'>
            <div className='card bg-secondary bg-opacity-10'>
                <div
                    className='card-header d-flex align-items-center justify-content-center'
                    data-bs-toggle='collapse'
                    data-bs-target={`#collapsedAdd`}
                    style={{ cursor: 'pointer', }}
                >
                    <span className=" fw-medium" style={{ fontSize: '23px' }}>New Todo</span>
                </div>

                <div id="collapsedAdd" className='collapse'>
                    <div className='card-body bg-opacity-10'>
                        <NewTodoForm addTodo={addTodo} onSuccess={() => setRefresh(prev => !prev)}/>
                    </div>
                </div>
            </div>

            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} onSuccess={() => setRefresh(prev => !prev)}/>
            ))}

        </div>
    );
}