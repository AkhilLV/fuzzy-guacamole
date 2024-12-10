import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  let navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, []);

  navigate("/dashboard");

  return <div className="dashboard"></div>;
}
