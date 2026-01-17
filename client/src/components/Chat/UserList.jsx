export default function UserList({ users, selectUser }) {
  return (
    <div style={{ padding: 10 }}>
      <h3>Users</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map(u => (
          <li key={u._id} onClick={() => selectUser(u)} style={{ padding: 10, margin: 5, border: "1px solid #ccc", borderRadius: 5, cursor: "pointer" }}>
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
