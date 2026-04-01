import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { TodoModel } from "../../models/TodoModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useParams } from "react-router-dom";

export const TodoPage:React.FC<{setRefresh: React.Dispatch<React.SetStateAction<boolean>>}> = ({setRefresh}) => {
    const [todo, setTodo] = useState<TodoModel>();

    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    const { id } = useParams<{ id: string }>();

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(todo?.title || "");

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [description, setDescription] = useState(todo?.description || "");

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = async () => {
        let body: any = {};

        if (isEditingTitle) {
            body.title = title;
        }

        if (isEditingDescription) {
            body.description = description;
        }

        try {
            await fetch(`http://localhost:8080/api/todos/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(body)
            });
            
            setTodo(prev =>
                prev
                    ? {
                        ...prev,
                        ...body,
                    }
                    : prev
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
            const response = await fetch(`http://localhost:8080/api/todos/${id}`);

            if (!response.ok) {
                throw new Error("Some thing went wrong!");
            }

            const data = await response.json();
            
            setTodo(data);
            setIsLoading(false);
        };

        fetchTodos().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [id])

    useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description);
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
                    {isEditingTitle ? (
                        <input
                            placeholder="Title..."
                            type="text"
                            className="form-control border-1 border-secondary border-opacity-25 shadow pb-2 pt-2 fw-medium"
                            style={{
                                fontSize: "3rem",
                                lineHeight: "1.3",
                                width: "100%",
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
                         className="form-control border-0 pb-2 pt-2 fw-medium bg-transparent"
                            style={{
                                fontSize: "3rem",
                                lineHeight: "1.3",
                                margin: 0,
                                color: title ? "black" : "#999",
                                cursor: "pointer",
                                wordBreak: "break-word",
                                overflowWrap: "break-word"
                            }}
                            onClick={() => { setIsEditingTitle(true); autoResize() }}

                        >
                            {title || "Title..."}
                        </h1>
                    )}
                    <div className="mt-1">
                        {isEditingDescription ? (
                            <textarea
                                placeholder="Desciption..."
                                ref={textareaRef}
                                rows={1}
                                className="form-control border-1 border-secondary border-opacity-25 shadow p-3 "
                                style={{
                                    fontSize: "1.5rem",
                                    lineHeight: "1.3",
                                    width: "100%",
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
                            <span className="form-control border-0 shadow-none p-3 bg-transparent"
                                style={{
                                    fontSize: "1.5rem",
                                    lineHeight: "1.3",
                                    margin: 0,
                                    color: description ? "black" : "#999",
                                    cursor: "pointer",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word"
                                }}
                                onClick={() => setIsEditingDescription(true)}
                            >
                                {description || "Desciption..."}
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