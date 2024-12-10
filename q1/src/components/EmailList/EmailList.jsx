import "./EmailList.css";

import { NavLink } from "react-router";

import clsx from "clsx";

function EmailList({ emails, favorites, read }) {
  return (
    <div className="email-list">
      {emails &&
        emails.map((email) => (
          <NavLink
            to={`/${email.id}?from=${email.from.email}&subject=${email.subject}&date=${email.date}`}
            key={email.id}
            className={({ isActive }) =>
              clsx({ active: isActive, read: read.includes(email.id) })
            }
          >
            <div className="email" data-id={email.id}>
              <div className="avatar">{email.from.name[0].toUpperCase()}</div>
              <div>
                <p className="from">
                  From:
                  <span className="bold">
                    {email.from.name}
                    {`<${email.from.email}>`}
                  </span>
                </p>
                <p className="subject">
                  Subject: <span className="bold">{email.subject}</span>
                </p>
                <p className="short-description">{email.short_description}</p>
                <div className="flex">
                  <p>
                    {new Date(email.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  {favorites.includes(email.id) && (
                    <span className="favorite-badge">Favorite</span>
                  )}
                </div>
              </div>
            </div>
          </NavLink>
        ))}
    </div>
  );
}

export default EmailList;
