import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import View from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../../components/pagination/Pagination";
import ApproveIcon from "@mui/icons-material/CheckCircle";
import RejectIcon from "@mui/icons-material/Cancel";
import { convertStatus } from "../../../utils/recipeUtils";

export default function AdminRecipes() {
  const itemsPerPage = 9;

  const { currentUser } = useAuthStore();

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [err, setErr] = useState("");

  const [searchParams] = useSearchParams();
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [searchParams]);

  const fetchRecipes = async () => {
    try {
      const response = await makeRequest.get(`/recipes/getadmin`, {
        params: {
          pageSize: itemsPerPage,
          page: searchParams.get("page") || 1,
          sort: "status desc",
        },
      });
      setRecipes(response.data.recipes);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  const approveThisRecipe = async (recipeId) => {
    try {
      const response = await makeRequest.patch(
        `/recipes/approve/${recipeId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    }
  };

  const rejectThisRecipe = async (recipeId) => {
    try {
      const response = await makeRequest.patch(
        `/recipes/reject/${recipeId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    }
  };

  const deleteThisRecipe = async (recipeId) => {
    try {
      const response = await makeRequest.delete(
        `/recipes/${recipeId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const choiceSure = confirm("Впевнені що хочете видалити? id:");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await deleteThisRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error("Помилка при видаленні рецепту:", error);
        setErr("");
      }
    }
  };

  const handleApprove = async (id) => {
    const choiceSure = confirm("Впевнені що хочете опублікувати?");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await approveThisRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error("Помилка при видаленні рецепту:", error);
        setErr("");
      }
    }
  };

  const handleReject = async (id) => {
    const choiceSure = confirm("Впевнені що хочете відхилити?");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await rejectThisRecipe(id);
        fetchRecipes();
      } catch (error) {
        console.error("Помилка при видаленні рецепту:", error);
        setErr("");
      }
    }
  };

  return (
    <div className="admin_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Керування рецептами
      </div>
      <button
        className="adm_button button1"
        onClick={() => navigate("/admin/recipes/submitted")}
      >
        Перейти до запропонованих рецептів
      </button>
      {err && <span style={{ color: "red" }}>{err}</span>}
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>id</th>
              <th>Назва</th>
              <th>id Юзера</th>
              <th>Створений</th>
              <th>Оновлений</th>
              <th>Затверджений</th>
              <th>id Кухні</th>
              <th>Рейтинг</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
            {recipes &&
              recipes.map((recipe) => (
                <tr key={recipe.id}>
                  <td>{recipe.id}</td>
                  <td>{recipe.title}</td>
                  <td>{recipe.userId}</td>
                  <td>{recipe.createdAt}</td>
                  <td>{recipe.updatedAt}</td>
                  <td>{recipe.confirmedAt}</td>
                  <td>{recipe.cuisineId}</td>
                  <td>{recipe.currentRating}</td>
                  <td>{convertStatus(recipe.status).name}</td>
                  <td>
                    {recipe.status === "Submitted" && (
                      <>
                        <ApproveIcon
                          className="icon"
                          onClick={() => handleApprove(recipe.id)}
                        />
                        <RejectIcon
                          className="icon red"
                          onClick={() => handleReject(recipe.id)}
                        />
                      </>
                    )}
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                      to={"/admin/recipes/edit/" + recipe.id}
                    >
                      <EditIcon className="icon" />
                    </Link>
                    <DeleteIcon
                      className="icon red"
                      onClick={() => handleDelete(recipe.id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {totalCount > itemsPerPage && <Pagination totalPages={totalPages} />}
    </div>
  );
}
