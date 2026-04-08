import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { TodoModel } from "../../models/TodoModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useParams } from "react-router-dom";

export const TodoPage: React.FC<{ setRefresh: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setRefresh }) => {
    const [todo, setTodo] = useState<TodoModel>();

    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    const { id } = useParams<{ id: string }>();

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(todo?.title || "");

    const [priority, setPriority] = useState(todo?.priority || 0);

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState(todo?.description || "");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        const body: Partial<TodoModel> = {};

        if (isEditingTitle) body.title = title;
        if (isEditingDescription) body.description = description;
        body.priority = priority;

        try {
            const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            setTodo(prev =>
                prev ? { ...prev, ...body } : prev
            );

            setRefresh(prev => !prev);
        } catch (error) {
            console.log(error);
        }
        setIsEditingTitle(false);
        setIsEditingDescription(false);
    };

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }

                const data = await response.json();

                setTodo(data);

            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, [id]);

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description);
            setPriority(todo.priority);
        }
    }, [todo]);

    const autoResize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    };

    useEffect(() => {
        autoResize();
    }, [description]);

    useLayoutEffect(() => {
        if (isEditingDescription) {
            autoResize();
        }
    }, [isEditingDescription, description]);

    const updatePriority = async (value: number) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    priority: value
                })
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            setPriority(value);
            setTodo(prev => prev ? { ...prev, priority: value } : prev);

            setRefresh(prev => !prev);

        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return <SpinnerLoading />
    }

    if (httpError) {
        return <p>{httpError}</p>
    }

    return (
        <div className='mt-5 container w-75'>
            {todo ? (
                <>
                    <div className="d-flex justify-content-between">
                        {isEditingTitle ? (
                            <input
                                placeholder="Title..."
                                type="text"
                                className="form-control border-1 border-secondary border-opacity-25 shadow pb-2 pt-2 fw-medium"
                                style={{
                                    fontSize: "3rem",
                                    lineHeight: "1.3",
                                    borderRadius: 10,
                                    width: "91%",
                                    outline: "none",
                                }}
                                value={title}
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave();
                                }}
                            />
                        ) : (
                            <h1
                                aria-placeholder="Title..."
                                className="form-control border-0 pb-2 pt-2 fw-medium bg-dark bg-opacity-10"
                                style={{
                                    fontSize: "3rem",
                                    lineHeight: "1.3",
                                    margin: 0,
                                    borderRadius: 10,
                                    color: title ? "black" : "#999",
                                    cursor: "pointer",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    width: "91%"
                                }}
                                onClick={() => { setIsEditingTitle(true); autoResize() }}

                            >
                                {title}
                            </h1>
                        )}

                        <div className="dropdown dropdown-menu-end align-content-center">
                            <div className="d-flex align-items-center">

                                <button
                                    className="btn bg-secondary bg-opacity-10 p-3"
                                    style={{ minWidth: "60px", width: "60px", borderRadius: 10, }}
                                    type="button"
                                    data-bs-toggle="dropdown"
                                >
                                    <span style={{ fontSize: 30 }}> {priority} </span>
                                </button>

                                <ul className="dropdown-menu" style={{ minWidth: "60px", width: "60px" }}>
                                    <li>
                                        <button
                                            className={`dropdown-item ${priority === 1 ? "active" : ""}`}
                                            onClick={() => updatePriority(1)}
                                        >
                                            1
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            className={`dropdown-item ${priority === 2 ? "active" : ""}`}
                                            onClick={() => updatePriority(2)}
                                        >
                                            2
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            className={`dropdown-item ${priority === 3 ? "active" : ""}`}
                                            onClick={() => updatePriority(3)}
                                        >
                                            3
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className={`dropdown-item ${priority === 4 ? "active" : ""}`}
                                            onClick={() => updatePriority(4)}
                                        >
                                            4
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className={`dropdown-item ${priority === 5 ? "active" : ""}`}
                                            onClick={() => updatePriority(5)}
                                        >
                                            5
                                        </button>
                                    </li>
                                </ul>
                                
                            </div>
                        </div>

                    </div>
                    <div className="mt-1">
                        {isEditingDescription ? (
                            <textarea
                                placeholder="Desciption..."
                                ref={textareaRef}
                                rows={1}
                                className="mt-3 form-control border-1 border-secondary border-opacity-25 shadow p-3 "
                                style={{
                                    fontSize: "1.5rem",
                                    lineHeight: "1.3",
                                    maxHeight: 500, minHeight:500,
                                    borderRadius: 10,
                                    outline: "none",
                                    resize: "none",
                                    overflow: "hidden"
                                }}
                                value={description}
                                autoFocus
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    autoResize();
                                }}
                                onBlur={handleSave}
                            />
                        ) : (
                            <span className="form-control border-0 shadow-none p-3 bg-dark bg-opacity-10 mt-3"
                                style={{
                                    fontSize: "1.5rem",
                                    lineHeight: "1.3",
                                    maxHeight: 500, minHeight:500,
                                    margin: 0,
                                    borderRadius: 10,
                                    color: description ? "black" : "#999",
                                    cursor: "pointer",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word"
                                }}
                                onClick={() => setIsEditingDescription(true)}
                            >
                                {description}
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}