import React, { useState, useEffect } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 1; // Number of items per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?_page=${currentPage}&_limit=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const totalCountHeader = response.headers.get("x-total-count");
        const totalCount = totalCountHeader
          ? parseInt(totalCountHeader, 10)
          : 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
        const data = await response.json();
        if (currentPage === 1) {
          setUsers(data);
        } else {
          setUsers((prevUsers) => [...prevUsers, ...data]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (currentPage !== 1) {
      fetchUsers();
    }
  }, [currentPage]);

  const handleViewMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
      {(currentPage < totalPages || users.length === 0) && (
        <button onClick={handleViewMore}>
          {users.length === 0 ? "Load Users" : "View More"}
        </button>
      )}
      {currentPage > 1 && (
        <p>
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
};

export default UsersPage;
