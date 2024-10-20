import "./App.css";
import { useUsers } from "@/features/auth/hooks/useUsers";

function App() {
  const { data } = useUsers();

  console.log("users data", data);

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
