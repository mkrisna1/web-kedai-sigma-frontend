import "./login.css";

function Login() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Kedai Sigma</h1>
        <p className="login-subtitle">Admin Login</p>

        <input className="login-input" placeholder="Username" />
        <input className="login-input" type="password" placeholder="Password" />

        <button className="login-button">Login</button>

        <p className="login-footer">© 2025 Kedai Sigma</p>
      </div>
    </div>
  );
}