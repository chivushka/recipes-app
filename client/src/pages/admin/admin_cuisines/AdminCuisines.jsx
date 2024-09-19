import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import View from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../components/pagination/Pagination";

export default function AdminCuisines() {
  const cuisinesPerPage = 5;

  const { currentUser } = useAuthStore();

  const [cuisines, setCuisines] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [err, setErr] = useState("");

  const [searchParams] = useSearchParams();
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchCuisines();
  }, []);

  useEffect(() => {
    fetchCuisines();
  }, [searchParams]);

  const fetchCuisines = async () => {
    try {
      const response = await makeRequest.get(`/cuisines/getadmin`, {
        params: {
          pageSize: cuisinesPerPage,
          page: searchParams.get("page") || 1,
          sort: "id asc",
        },
      });
      setCuisines(response.data.cuisines);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch cuisines:", error);
    }
  };

  const deleteCuisine = async (cuisineId) => {
    try {
      const response = await makeRequest.delete(
        `/cuisines/${cuisineId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete cuisine:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const deleteSure = confirm("Впевнені що хочете видалити?");
    console.log(deleteSure);
    if (deleteSure) {
      try {
        await deleteCuisine(id);
        fetchCuisines();
      } catch (error) {
        if (error.response.status === 400) {
          setErr("У даній кухні світу наявні рецепти");
        } else {
          console.error("Помилка при видаленні користувача:", error);
          setErr("");
        }
      }
    }
  };

  return (
    <div className="admin_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Керування кухнями світу
      </div>
      <button className="adm_button button1" onClick={()=>navigate("/admin/cuisines/add")}>Додати</button>
      {err && <span style={{ color: "red" }}>{err}</span>}
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>id</th>
              <th>Назва</th>
              <th>Опис</th>
              <th>Зображення</th>
              <th>Дії</th>
            </tr>
            {cuisines &&
              cuisines.map((cuisine) => (
                <tr key={cuisine.id}>
                  <td>{cuisine.id}</td>
                  <td>{cuisine.name}</td>
                  <td>{cuisine.text}</td>
                  <td>{cuisine.img}</td>
                  <td>
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      to={"/admin/cuisines/edit/" + cuisine.id}
                    >
                      <EditIcon className="icon" />
                    </Link>
                    {cuisine.id !== 1 && (
                      <DeleteIcon
                        className="icon red"
                        onClick={() => handleDelete(cuisine.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalCount > cuisinesPerPage && <Pagination totalPages={totalPages} />}
    </div>
  );
}
