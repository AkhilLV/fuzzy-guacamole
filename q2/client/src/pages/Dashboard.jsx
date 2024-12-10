import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { useSearchParams } from "react-router";

import { useAuth } from "../components/AuthProvider/AuthProvider";

import { getCookie, setCookie } from "../helpers/CookieHelper";

import Filter from "../components/Filter/Filter";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const buildQueryString = (filters) => {
  let string = "";
  if (filters.age) {
    string += `age=${filters.age}&`;
  }

  if (filters.gender) {
    string += `gender=${filters.gender}&`;
  }

  if (filters.start) {
    string += `start=${filters.start}&`;
  }

  if (filters.end) {
    string += `end=${filters.end}&`;
  }

  return string;
};

export default function Dashboard() {
  let navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const { authState } = useAuth();

  const [showToast, setShowToast] = useState(false);

  const [clickedFeature, setClickedFeature] = useState("A");

  const [chartData, setChartData] = useState({
    labels: ["A", "B", "C", "D", "E", "F"],
    datasets: [
      {
        label: "Feature",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  const [lineData, setLineData] = useState({
    labels: ["A", "B", "C", "D", "E", "F"],
    datasets: [
      {
        label: "Feature Sums",
        data: [0, 2, 3, 4, 5, 10],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  const handleBarClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const clickedIndex = chartElement[0].index;
      const clickedLabel = chartData.labels[clickedIndex];
      setClickedFeature(clickedLabel);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Features and consumption by hours",
      },
    },
    indexAxis: "y",
    onClick: handleBarClick,
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Feature Sums Over Categories",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Features",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sum Values",
        },
      },
    },
  };

  const prevFilters = JSON.parse(getCookie(authState.username));
  const [filters, setFilters] = useState(
    prevFilters || {
      age: searchParams.get("age") || prevFilters?.age || null,
      start: searchParams.get("start") || prevFilters?.start || "2022-10-04",
      end: searchParams.get("end") || prevFilters?.end || "2022-10-29",
      gender: searchParams.get("gender") || prevFilters?.gender || null,
    }
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const queryString = buildQueryString(filters);

        const response = await fetch(
          `https://fuzzy-guacamole.onrender.com/data?${queryString}`,
          {
            credentials: "include",
          }
        );
        const resJson = await response.json();

        setChartData((prev) => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: Object.values(resJson.data[0]),
            },
          ],
        }));
        setCookie(authState.username, JSON.stringify(filters));

        const lineResponse = await fetch(
          `https://fuzzy-guacamole.onrender.com/data/time-trend?${queryString}`,
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ feature: clickedFeature }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const lineResJson = await lineResponse.json();
        console.log(lineResJson);

        setLineData((prev) => ({
          labels: lineResJson.data.map((row) => row.Day),
          datasets: [
            {
              label: "Feature Sums",
              data: lineResJson.data.map((row) => row.total_feature_value),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        }));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, [filters, authState.username, clickedFeature]);

  const handleClearCookie = (e) => {
    setFilters({
      age: null,
      start: "2022-10-04",
      end: "2022-10-29",
      gender: null,
    });
  };

  const handleCopyClick = (e) => {
    navigator.clipboard.writeText(
      `http://localhost:5173/dashboard?${buildQueryString(filters)}`
    );

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleLogoutClick = async () => {
    const response = await fetch(
      "https://fuzzy-guacamole.onrender.com/auth/logout",
      {
        credentials: "include",
      }
    );

    const resData = await response.json();

    if (resData.success) {
      navigate("/login");
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
        <button className="primary outline" onClick={handleCopyClick}>
          <img src="/share.svg" alt="" height={20} width={20} />
          Copy share url
        </button>
        <button className="primary logout" onClick={handleLogoutClick}>
          <img src="/logout.svg" alt="" height={20} width={20} />
          Logout
        </button>
      </header>
      <p className="user-greeting">Hello {authState.username}</p>

      <Filter
        filterCategory="age"
        filterValues={["15-25", ">25"]}
        setFilters={setFilters}
        filters={filters}
      />

      <Filter
        filterCategory="gender"
        filterValues={["Male", "Female"]}
        setFilters={setFilters}
        filters={filters}
      />

      <label className="start">
        Start:
        <input
          type="date"
          value={filters.start}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, start: e.target.value }))
          }
        />
      </label>

      <label className="end">
        End:
        <input
          type="date"
          value={filters.end}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, end: e.target.value }))
          }
        />
      </label>

      <a href="#" className="clear-cookie" onClick={handleClearCookie}>
        Reset filters and cookies
      </a>
      <div className="flex">
        <Bar data={chartData} options={options} className="graph" />
        <Line data={lineData} options={lineOptions} className="graph" />
      </div>

      {showToast && <div className="toast">Copied to clipboard!</div>}
    </div>
  );
}
