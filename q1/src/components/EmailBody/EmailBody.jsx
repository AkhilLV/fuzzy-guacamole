import "./EmailBody.css";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useOutletContext } from "react-router";

function EmailBody() {
  let { id } = useParams();
  let [searchParams] = useSearchParams();

  const [emailBody, setEmailBody] = useState("");

  const [setFavorites, setRead] = useOutletContext();

  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      const response = await fetch(
        `https://flipkart-email-mock.now.sh/?id=${id}`
      );
      const data = await response.json();

      setEmailBody(data.body);

      setRead((prev) => {
        return [...prev, id]; // duplicates are being added. fix later
      });

      setIsLoading(false);
    }
    fetchData();
  }, [id, setRead]);

  const handleClick = (e) => {
    setFavorites((prev) => [...prev, id]);

    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <div className="email-body">
      <header>
        <div className="flex">
          <div className="avatar">
            {searchParams.get("from")[0].toUpperCase()}
          </div>
          <h1>{searchParams.get("subject")}</h1>

          <button className="fav-btn" onClick={handleClick} type="button">
            Mark as Favorite
          </button>
        </div>
      </header>

      <p className="date">
        {new Date(Number(searchParams.get("date"))).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </p>

      {isLoading ? (
        <div className="stage">
          <div className="dot-flashing center"></div>
        </div>
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: emailBody }}
        ></div>
      )}

      {showToast && <div className="toast">Marked as favorite</div>}
    </div>
  );
}

export default EmailBody;
