import React, { useState } from "react"

export const NewTodoForm: React.FC<{addTodo: Function; onSuccess: Function}> = (props) => {

    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');

    const submitTodo = async () => {
        try{
            const response = await fetch("http://localhost:8080/api/todos", {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    complete: false,
                }),
            });

            if(!response.ok){
                throw new Error("Failed to add todo");
            }

            const data = await response.json();
            props.addTodo(data);
            
            props.onSuccess();

            setTitle("");
            setDescription("");
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
            </form>
            <button 
            type="button" 
            className="btn btn-primary mt-3 w-100"
            onClick={()=>{submitTodo()}}
            >Add todo</button>
        </div>
    )

}