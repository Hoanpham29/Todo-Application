import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserModel } from "../../models/UserModel";

export const Changepasswordpage = () => {
    const [users, setUsers] = useState<UserModel>();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();
    const token = localStorage.getItem("token");
    const [httpError, setHttpError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            history.push("/login");
        }
    }, [token, history]);

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                history.push("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/users/info", {
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
                setUsers(data);

            } catch (error: any) {
                setHttpError(error.message);
            }
        };

        fetchTodos();
    }, [history]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    password,
                    newPassword,
                    confirmPassword
                }),
            });

            if (!response.ok) {
                throw new Error("Có lỗi xảy ra, vui lòng thử lại!");
            }

            history.push("/login");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (httpError) {
        return <p className="text-danger">{httpError}</p>;
    }

    const deleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("You have to login to do this!");
        return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
        const response = await fetch("http://localhost:8080/api/users", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Can not delete your account!");
        }

        localStorage.removeItem("token");

        alert("Your account has been delete!");

        window.location.href = "/login";

    } catch (error: any) {
        console.error(error);
        alert(error.message);
    }
};

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 border-0 mt-0" style={{ width: "600px" }}>
                <h3 className="text-center">User Information</h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3 mt-3">
                        <label className="form-label">Full name</label>
                        <input
                            type="text"
                            className="form-control"
                            style={{cursor: "default"}}
                            value={users?.fullName}
                            readOnly
                        />
                    </div>

                    <div className="mb-3 mt-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            style={{cursor: "default"}}
                            value={users?.email}
                            readOnly
                        />
                    </div>

                    <div className="mb-3 mt-3">
                        <label className="form-label">Old password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">New password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={
                            isLoading ||
                            !password ||
                            !newPassword ||
                            !confirmPassword ||
                            newPassword !== confirmPassword
                        }
                    >
                        {isLoading ?
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : "Ok"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger w-100 mt-2"
                        onClick={() => deleteAccount()}
                    >
                        {isLoading ?
                            <div className="spinner-border text-light" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div> : "Delete account"}
                    </button>
                </form>
            </div>
        </div>
    );
};