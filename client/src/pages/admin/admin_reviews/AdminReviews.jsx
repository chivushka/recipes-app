import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { makeRequest } from "../../../axi";
import Pagination from "../../../components/pagination/Pagination";
import ViewIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import ApproveIcon from "@mui/icons-material/CheckCircle";

export default function AdminReviews() {
  const itemsPerPage = 10;

  const { currentUser } = useAuthStore();

  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [err, setErr] = useState("");

  const [searchParams] = useSearchParams();
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchReviews();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [searchParams]);

  const fetchReviews = async () => {
    try {
      const response = await makeRequest.get(`/reviews/getadmin`, {
        params: {
          pageSize: itemsPerPage,
          page: searchParams.get("page") || 1,
          sort: "status asc",
        },
      });
      console.log(response.data);
      setReviews(response.data.reviews);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const deleteThisReview = async (reviewId) => {
    try {
      const response = await makeRequest.delete(
        `/reviews/${reviewId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
    }
  };

  const approveThisReview = async (reviewId) => {
    try {
      const response = await makeRequest.patch(
        `/reviews/approve/${reviewId}?userId=${currentUser.id}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const choiceSure = confirm("Впевнені що хочете видалити?");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await deleteThisReview(id);
        fetchReviews();
      } catch (error) {
        console.error("Помилка при видаленні відгуку:", error);
        setErr("");
      }
    }
  };

  const handleApprove = async (id) => {
    const choiceSure = confirm("Впевнені що хочете опублікувати?");
    console.log(choiceSure);
    if (choiceSure) {
      try {
        await approveThisReview(id);
        fetchReviews();
      } catch (error) {
        console.error("Помилка при затвердженні відгуку:", error);
        setErr("");
      }
    }
  };

  return (
    <div className="admin_page inter-regular">
      <div className="montserrat-alternates-medium header2 header">
        Керування відгуками
      </div>
      {err && <span style={{ color: "red" }}>{err}</span>}
      <div className="section">
        <table>
          <tbody>
            <tr>
              <th>id</th>
              <th>id Юзера</th>
              <th>id Рецепту</th>
              <th>Оцінка</th>
              <th>Текст</th>
              <th>Створений</th>
              <th>Статус</th>
              <th>Зображення</th>
              <th>Дії</th>
            </tr>
            {reviews &&
              reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>
                    {" "}
                    <div className="go">{review.userId} <ViewIcon className="icon" onClick={()=>navigate("/cook/"+ review.userId)}/></div>
                  </td>
                  <td>
                    {" "}
                    <div className="go">{review.recipeId} <ViewIcon className="icon" onClick={()=>navigate("/recipes/"+ review.recipeId)}/></div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {review.rating}
                      <StarIcon
                        style={{ color: "#e70000", fontSize: "20px" }}
                      />
                    </div>
                  </td>
                  <td>{review.text}</td>
                  <td>{review.createdAt}</td>

                  <td>{review.status}</td>
                  <td>
                    {review.img && (
                      <img
                        className="file_review"
                        src={"/upload/" + review.img}
                      />
                    )}
                  </td>

                  <td>
                    <ApproveIcon
                      className="icon"
                      onClick={() => handleApprove(review.id)}
                    />
                    <DeleteIcon
                      className="icon red"
                      onClick={() => handleDelete(review.id)}
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
