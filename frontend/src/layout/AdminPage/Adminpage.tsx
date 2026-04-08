import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { UserModel } from "../../models/UserModel";

export const Adminpage = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = (user: UserModel) => {
        return user.authorities.some(a => a.authority === "ROLE_ADMIN");
    };

    useEffect(() => {
        const fetchAllUsers = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("http://localhost:8080/api/admin", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 401 || response.status === 403) {
                    window.location.href = "/login";
                    return;
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllUsers();
    }, []);

    const deleteUser = async (id: number) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Delete user?")) return;

        try {
            await fetch(`http://localhost:8080/api/admin/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const promoteToAdmin = async (user: UserModel) => {
        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:8080/api/admin/promoted/${user.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(prev =>
                prev.map(u =>
                    u.id === user.id && !isAdmin(u)
                        ? {
                            ...u,
                            authorities: [
                                ...u.authorities,
                                { authority: "ROLE_ADMIN" },
                            ],
                        }
                        : u
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) return <SpinnerLoading />;

    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

            <div className="rounded border overflow-hidden">
                <table className="table table-hover mb-0">

                    <thead className="table-light">
                        <tr>
                            <th className="text-muted">ID</th>
                            <th className="text-muted">Name</th>
                            <th className="text-muted">Email</th>
                            <th className="text-muted">Roles</th>
                            <th className="text-muted">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="fw-semibold">{user.id}</td>

                                <td>
                                    <div className="fw-semibold">{user.fullName}</div>
                                </td>

                                <td className="text-muted">{user.email}</td>

                                <td>
                                    {user.authorities.some(a => a.authority === "ROLE_ADMIN") ? (
                                        <span className="badge rounded-pill px-3 py-2 bg-success-subtle text-success">
                                            ADMIN
                                        </span>
                                    ) : (
                                        <span className="badge rounded-pill px-3 py-2 bg-secondary-subtle text-secondary">
                                            USER
                                        </span>
                                    )}
                                </td>

                                <td>
                                        <button
                                            className="btn btn-sm btn-outline-warning me-2"
                                            disabled={isAdmin(user)}
                                            onClick={() => promoteToAdmin(user)}
                                        >
                                            Promote
                                        </button>

                                    <button
                                        className="btn btn-sm btn-outline-danger" 
                                        disabled={isAdmin(user)}
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
};