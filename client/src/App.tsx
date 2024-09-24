import "./App.css";
import { useUsers } from "@/features/auth/services/useUsers";

function App() {
  const { users } = useUsers();

  console.log("users", users);

  return (
    <>
      <h1>React</h1>
      <div className="card">
        <h1>Hello world!</h1>
      </div>
      <p className="read-the-docs">POC with react-query and axios</p>
    </>
  );
}

export default App;
