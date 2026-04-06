import React, { useState } from "react"
import { useHistory } from "react-router-dom";

export const NewTodoForm: React.FC<{addTodo: Function; onSuccess: Function}> = (props) => {

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState(1);
    const history = useHistory();

    const submitTodo = async () => {
        const token = localStorage.getItem("token");

            if (!token) {
                history.push("/login");
                return;
            }
        
        try{
            const response = await fetch("http://localhost:8080/api/todos", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    complete: false,
                    priority: priority
                }),
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            if(!response.ok){
                throw new Error("Failed to add todo");
            }

            const data = await response.json();
            props.addTodo(data);
            
            props.onSuccess();

            setTitle("");
            setDescription("");
            setPriority(1);
        }catch(error){
            console.log(error);
        }
    }

    return(
        <div className="">
            <form>
                <div className="mb-3">
                    <h6 className="form-label">Title</h6>
                    <input 
                    type="text" 
                    className="form-control" 
                    onChange={e => setTitle(e.target.value)} 
                    value={title}
                    required></input>
                </div>
                <div className="mb-3">
                    <h6 className="form-label">Description</h6>
                    <textarea 
                        className="form-control" 
                        rows={3} 
                        required
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                        >   
                    </textarea>
                </div>
                <div className="mb-3">
                    <h6 className="form-label">Priority</h6>
                    <div className="dropdown dropdown-menu-end align-content-center">
                            <div className="d-flex align-items-center">

                                <button
                                    className="btn bg-secondary bg-opacity-10"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    <span style={{ fontSize: 20 }}> {priority} </span>
                                </button>
                                <ul className="dropdown-menu" style={{ minWidth: "110px", width: "110px" }}>
                                    <li>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${priority === 1 ? "active" : ""}`}
                                            onClick={() => setPriority(1)}
                                        >
                                            1
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${priority === 2 ? "active" : ""}`}
                                            onClick={() => setPriority(2)}
                                        >
                                            2
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${priority === 3 ? "active" : ""}`}
                                            onClick={() => setPriority(3)}
                                        >
                                            3
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${priority === 4 ? "active" : ""}`}
                                            onClick={() => setPriority(4)}
                                        >
                                            4
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className={`dropdown-item ${priority === 5 ? "active" : ""}`}
                                            onClick={() => setPriority(5)}
                                        >
                                            5
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                </div>
            </form>
            <button 
            type="button" 
            className="btn btn-primary mt-3 w-100"
            onClick={()=>{submitTodo()}}
            >Add todo</button>
        </div>
    )

}