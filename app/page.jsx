"use client";

import { useState, useEffect } from "react";

const API_URL = "https://frontend-backend-xcka.onrender.com";

export default function App() {
  const [token, setToken] = useState(null);
  const [view, setView] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    showToast("Login successful!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    showToast("Logged out");
  };

  return (
    <>
      <div className="ambient-glow"></div>

      {!token ? (
        <LoginView onLogin={handleLogin} showToast={showToast} />
      ) : (
        <div className="dashboard-layout">
          <Sidebar
            currentView={view}
            setView={setView}
            onLogout={handleLogout}
          />
          <div className="main-content">
            <Navbar />
            <div className="page-container">
              {view === "dashboard" && <DashboardOverview />}
              {view === "students" && (
                <StudentsView token={token} showToast={showToast} />
              )}
              {view === "tasks" && (
                <TasksView token={token} showToast={showToast} />
              )}
              {view === "subjects" && (
                <SubjectsView token={token} showToast={showToast} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

// ================= LOGIN COMPONENT =================
function LoginView({ onLogin, showToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegistering ? "/auth/register" : "/auth/login";

    let body;
    if (isRegistering) {
      body = JSON.stringify({ name, email, password });
    } else {
      body = JSON.stringify({ email, password });
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      onLogin(data.access_token);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card">
        <h1 className="auth-title">System.</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {isRegistering && (
            <div className="input-group">
              <label>Full Name</label>
              <input
                className="apple-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Email Address</label>
            <input
              className="apple-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              className="apple-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="apple-btn" type="submit" disabled={loading}>
            {loading
              ? "Processing..."
              : isRegistering
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

function Sidebar({ currentView, setView, onLogout }) {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "students", label: "Students" },
    { id: "tasks", label: "Tasks" },
    { id: "subjects", label: "Subjects" },
  ];

  return (
    <div className="sidebar">
      <div className="brand">Acme Edu.</div>
      {menu.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${currentView === item.id ? "active" : ""}`}
          onClick={() => setView(item.id)}
        >
          {item.label}
        </div>
      ))}
      <div className="nav-item logout" onClick={onLogout}>
        Logout
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <div className="top-navbar">
      <div className="search-bar">
        <input
          className="apple-input"
          placeholder="Search everywhere..."
          style={{ padding: "8px 16px", borderRadius: "20px" }}
        />
      </div>
      <div className="user-controls">
        <div style={{ color: "var(--text-muted)" }}>🔔</div>
        <div className="avatar"></div>
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div>
      <h2 className="page-title" style={{ marginBottom: "40px" }}>
        Overview
      </h2>
      <div className="data-grid">
        <div className="glass-panel data-card">
          <div className="card-meta">Total Students</div>
          <div className="card-title" style={{ fontSize: "36px" }}>
            124
          </div>
        </div>
        <div className="glass-panel data-card">
          <div className="card-meta">Active Tasks</div>
          <div className="card-title" style={{ fontSize: "36px" }}>
            48
          </div>
        </div>
        <div className="glass-panel data-card">
          <div className="card-meta">System Status</div>
          <div
            className="card-title"
            style={{ fontSize: "36px", color: "var(--success)" }}
          >
            Optimal
          </div>
        </div>
      </div>
    </div>
  );
}


function StudentsView({ token, showToast }) {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    class_name: "",
    phone: "",
  });

  const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setStudents(await res.json());
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      showToast("Student created successfully!");
      setShowModal(false);
      fetchStudents();
    }
  };

  const deleteStudent = async (id) => {
    await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("Student deleted", "success");
    fetchStudents();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Students</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Student
        </button>
      </div>

      <div className="data-grid">
        {students.map((s) => (
          <div key={s.id} className="glass-panel data-card">
            <div className="card-title">{s.name}</div>
            <div className="card-meta">
              <span>{s.class_name}</span>
              <span>{s.phone}</span>
            </div>
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <button
                className="btn-secondary"
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  color: "var(--danger)",
                  borderColor: "rgba(255,69,58,0.3)",
                }}
                onClick={() => deleteStudent(s.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h3 className="modal-header">Create Student</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <input
                className="apple-input"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: parseInt(e.target.value) })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Class"
                value={formData.class_name}
                onChange={(e) =>
                  setFormData({ ...formData, class_name: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- TASKS ---
function TasksView({ token, showToast }) {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    student_id: "",
    status: "Pending",
  });

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTasks(await res.json());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        student_id: parseInt(formData.student_id),
      }),
    });
    if (res.ok) {
      showToast("Task assigned successfully!");
      setShowModal(false);
      fetchTasks();
    }
  };

  const updateStatus = async (task) => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...task, status: newStatus }),
    });
    showToast("Task updated");
    fetchTasks();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Tasks</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Task
        </button>
      </div>

      <div className="data-grid">
        {tasks.map((t) => (
          <div key={t.id} className="glass-panel data-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div className="card-title">{t.title}</div>
              <div className={`status-badge ${t.status.toLowerCase()}`}>
                {t.status}
              </div>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                margin: "8px 0",
              }}
            >
              {t.description}
            </p>
            <div style={{ marginTop: "auto", paddingTop: "16px" }}>
              <button
                className="btn-secondary"
                style={{ width: "100%", fontSize: "14px" }}
                onClick={() => updateStatus(t)}
              >
                Mark as {t.status === "Pending" ? "Completed" : "Pending"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h3 className="modal-header">Assign Task</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <input
                className="apple-input"
                placeholder="Task Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                className="apple-input"
                placeholder="Description"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Student ID (Number)"
                type="number"
                value={formData.student_id}
                onChange={(e) =>
                  setFormData({ ...formData, student_id: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUBJECTS ---
function SubjectsView({ token, showToast }) {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    teacher: "",
    hours: "",
    description: "",
  });

  const fetchSubjects = async () => {
    const res = await fetch(`${API_URL}/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setSubjects(await res.json());
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/subjects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...formData, hours: parseInt(formData.hours) }),
    });
    if (res.ok) {
      showToast("Subject created successfully!");
      setShowModal(false);
      fetchSubjects();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Subjects</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Subject
        </button>
      </div>

      <div className="data-grid">
        {subjects.map((s) => (
          <div key={s.id} className="glass-panel data-card">
            <div className="card-title">{s.name}</div>
            <div className="card-meta">
              <span>Teacher: {s.teacher}</span>
              <span>{s.hours} Hours</span>
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginTop: "8px",
              }}
            >
              {s.description}
            </p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <h3 className="modal-header">Add Subject</h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <input
                className="apple-input"
                placeholder="Subject Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Teacher Name"
                value={formData.teacher}
                onChange={(e) =>
                  setFormData({ ...formData, teacher: e.target.value })
                }
                required
              />
              <input
                className="apple-input"
                placeholder="Hours"
                type="number"
                value={formData.hours}
                onChange={(e) =>
                  setFormData({ ...formData, hours: e.target.value })
                }
                required
              />
              <textarea
                className="apple-input"
                placeholder="Description"
                rows="3"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
