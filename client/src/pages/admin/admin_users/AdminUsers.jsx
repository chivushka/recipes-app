import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import View from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../components/pagination/Pagination";
import { transformUserLevel } from "../../../utils/userUtils";

export default function AdminUsers() {
  const usersPerPage = 10;

  const { currentUser, logout } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [searchParams] = useSearchParams();
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  const fetchUsers = async () => {
    try {
      const response = await makeRequest.get(`/users/all`, {
        params: {
          pageSize: usersPerPage,
          page: searchParams.get("page") || 1,
        },
      });
      setUsers(response.data.users);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await makeRequest.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const deleteSure = confirm("Впевнені що хочете видалити?");
    console.log(deleteSure);
    if (deleteSure) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Помилка при видаленні користувача:", error);
      }
    }
  };

  return (
    <div className="admin_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Керування користувачами
      </div>
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>id</th>
              <th>Логін</th>
              <th>E-mail</th>
              <th>Ім'я</th>
              <th>Роль</th>
              <th>Рівень</th>
              <th>Про користувача</th>
              <th>Дії</th>
            </tr>
            {users &&
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.isAdmin == 1 ? "Адміністратор" : "Користувач"}</td>
                  <td>{transformUserLevel(user.level)}</td>
                  <td>{user.about ? user.about : "Пусто"}</td>
                  <td>
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      to={"/admin/users/edit/" + user.id}
                    >
                      <EditIcon className="icon" />
                    </Link>
                    {currentUser.id !== user.id && (
                      <DeleteIcon
                        className="icon red"
                        onClick={() => handleDelete(user.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalCount > usersPerPage && <Pagination totalPages={totalPages} />}
    </div>
  );
}
