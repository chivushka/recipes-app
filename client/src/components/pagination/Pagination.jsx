import React, { useEffect } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

export default function Pagination({ totalPages }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const params = new URLSearchParams([...searchParams]);
    if (!params.has("page")) {
      params.set("page", 1);
      navigate({
        pathname: location.pathname,
        search: params.toString(),
      });
    }
  }, []);
  const isPreviousDisabled = searchParams.get("page") <= 1;
  const isNextDisabled = searchParams.get("page") >= totalPages;

  const handlePreviousPage = (e) => {
    e.preventDefault();
    const newPage = +searchParams.get("page") - 1;
    handlePageChange(newPage);
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    const newPage = +searchParams.get("page") + 1;
    handlePageChange(newPage);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams([...searchParams]);
    params.set("page", newPage);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };
  return (
    <div className="pagination_container">
      {!isPreviousDisabled && (
        <button className="button" onClick={handlePreviousPage}>
          Попередня
        </button>
      )}
      {!isNextDisabled && (
        <button onClick={handleNextPage} className="button">
          Наступна
        </button>
      )}
    </div>
  );
}
