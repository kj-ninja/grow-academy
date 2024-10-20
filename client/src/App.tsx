import { useUsers } from "@/features/auth/hooks/useUsers";
import { Button } from "@/components/ui/Button";

function App() {
  const { data, refetch } = useUsers();

  return (
    <>
      <h1>React</h1>
      <div className="card">
        <h1>Hello world!</h1>
        <ul>{data?.map((user) => <li key={user.id}>{user.id}</li>)}</ul>
      </div>
      <p className="read-the-docs mb-1">POC with react-query and axios</p>
      <Button onClick={() => refetch()}>Fetch users</Button>
    </>
  );
}

export default App;
