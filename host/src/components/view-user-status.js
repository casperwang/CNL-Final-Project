import "./view-user-status.css";

function UserStatus({ userStatus }) {
  if (!userStatus[0]?.length) {
    return;
  }

  const numColumns = userStatus[0].length;

  return (
    <div className="user-status">
      <table>
        <thead>
          <tr>
            <th>User</th>
            {[...Array(numColumns)].map((_, index) =>
              <th key={index}>
                {index + 1}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {userStatus.map((status, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {status.map((stat, idx) => (
                <td
                  key={idx} className={stat ? "user-status-active" : "user-status-inactive"}></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserStatus;
