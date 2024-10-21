import { Link } from "react-router-dom";

export const AuthHeader = () => {
  return (
    <header>
      <Link to="/" className="flex flex-row items-center space-x-2">
        <h1>Grow Academy</h1>
      </Link>
    </header>
  );
};
