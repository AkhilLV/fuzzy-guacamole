import "./App.css";

import { useEffect, useState } from "react";
import { Outlet } from "react-router";

import Filter from "./components/Filter/Filter";
import EmailList from "./components/EmailList/EmailList";

let originalEmails;

function App() {
  const [emails, setEmails] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [read, setRead] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const response = await fetch("https://flipkart-email-mock.now.sh/");
      const data = await response.json();

      originalEmails = data.list;

      setEmails(data.list);

      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleFilter = (filterBy) => {
    switch (filterBy) {
      case "favorite":
        setEmails(
          originalEmails.filter((email) => favorites.includes(email.id))
        );

        break;
      case "read":
        setEmails(originalEmails.filter((email) => read.includes(email.id)));

        break;
      case "unread":
        setEmails(originalEmails.filter((email) => !read.includes(email.id)));

        break;
      case null:
        console.log(originalEmails);
        setEmails(originalEmails);
    }
  };

  return (
    <>
      <Filter
        emails={emails}
        setEmails={setEmails}
        favorites={favorites}
        onFilter={handleFilter}
      />
      {isLoading ? (
        <div className="stage">
          <div className="dot-flashing center"></div>
        </div>
      ) : (
        <div className="flex">
          {emails.length === 0 ? (
            <p>No emails found. Try changing your filtering criteria</p>
          ) : (
            <>
              <EmailList
                emails={emails}
                favorites={favorites}
                read={read}
                setRead={setRead}
              />
              <div className="body-container">
                {/* Outlet for the Email Body view */}
                {emails.length ? (
                  <Outlet context={[setFavorites, setRead]} />
                ) : (
                  ""
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;

