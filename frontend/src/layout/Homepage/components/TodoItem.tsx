import { useState } from "react";
import { TodoModel } from "../../../models/TodoModel";
import { useHistory } from "react-router-dom";

export const TodoItem: React.FC<{ todo: TodoModel; onSuccess: Function }> = (props) => {

    const collapseId = `todo-${props.todo.id}`;

    const [checked, setChecked] = useState(props.todo.complete);
    const history = useHistory();

    const handleToggle = async () => {
        const newValue = !checked;

        setChecked(newValue);

        const token = localStorage.getItem("token");

            if (!token) {
                history.push("/login");
                return;
            }

        try {
            const response = await fetch(
                `http://localhost:8080/api/todos/toggleComplete/${props.todo.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        completed: newValue,
                    }),
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Update failed");
            }

            props.onSuccess?.();

        } catch (error) {
            console.log(error);
            setChecked(!newValue);
        }
    };

    const submitDelete = async () =>{
        const token = localStorage.getItem("token");

            if (!token) {
                history.push("/login");
                return;
            }
        
        try {
            const response = await fetch(
                `http://localhost:8080/api/todos/${props.todo.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Update failed");
            }

            props.onSuccess?.();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <input type="checkbox" className="btn-check" />

            <div className='card mt-3'>
                <div className="btn-group">

                    <input
                        type="checkbox"
                        className="btn-check"
                        checked={checked}
                        id={`check-${props.todo.id}`}
                        onClick={() => setChecked(prev => !prev)}
                        onChange={handleToggle}
                    />
                    <label
                        className="btn btn-outline-success d-flex 
                        align-items-center justify-content-center"
                        htmlFor={`check-${props.todo.id}`}
                    >
                        <i className="bi bi-check-lg"></i>
                    </label>

                    <div
                        className='card-header d-flex align-items-center w-100'
                        data-bs-toggle='collapse'
                        data-bs-target={`#${collapseId}`}
                        style={{ cursor: 'pointer' }}
                    >
                        <span className=" fw-medium"
                            style={{ fontSize: '20px', textDecoration: checked ? "line-through" : "none" }}>
                            {props.todo.title}
                        </span>

                    </div>

                    <input
                        type="checkbox"
                        className="btn-check"
                        checked={checked}
                        id={`delete-${props.todo.id}`}
                        onClick={() => submitDelete()}
                    />
                    <label
                        className="btn btn-outline-danger d-flex 
                        align-items-center justify-content-center"
                        htmlFor={`delete-${props.todo.id}`}
                    >
                        <i className="bi bi-trash"></i>
                    </label>

                </div>

                <div id={collapseId} className='collapse show'>
                    <div className='card-body'>
                        <p>{props.todo.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};