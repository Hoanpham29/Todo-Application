import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Email hoặc mật khẩu không đúng!");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);

            history.push("/");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary bg-opacity-10">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center">Login</h3>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 mt-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? <div className=" spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : "Login"}
                    </button>
                    <div className="mt-2">
                    <span>Doesn't have account yet? <Link to={`/register`}>Sign up</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
};