import React, { useEffect, useState } from "react";
import "./Search.scss";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { makeRequest } from "../../axi";
import SearchList from "../../components/search_list/SearchList";
import Pagination from "../../components/pagination/Pagination";

export default function Search() {
  const itemsPerPage = 4;

  const [searchItems, setSearchItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    fetchSearch();
  }, []);

  useEffect(() => {
    fetchSearch();
  }, [searchParams]);

  useEffect(() => {
    const EnterEvent = (e) => {
      if (e.key === "Enter") {
        handleSearchSubmit(e);
      }
    };
    document.addEventListener("keydown", EnterEvent);
    return () => {
      document.removeEventListener("keydown", EnterEvent);
    };
  }, []);

  const fetchSearch = async () => {
    try {
      const response = await makeRequest.get("/search/", {
        params: {
          searchText: searchParams.get("search") || "",
          stype: searchParams.get("stype") || "name",
          page: searchParams.get("page") || 1,
          pageSize: searchParams.get("pageSize") || itemsPerPage,
        },
      });
      console.log(response.data);
      setSearchItems(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setErr("");
    } catch (error) {
      if (error.response.status === 401) {
        setErr("Ви не авторизовані");
      }
      console.log(error);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.stopPropagation();
    const params = new URLSearchParams([...searchParams]);
    const input = document.getElementsByName("search")[0];
    params.set("search", input.value);
    params.set("page", 1);
    const select = document.getElementsByName("stype")[0];
    params.set("stype", select.value);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  const handleSearchTypeChange = async (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    const params = new URLSearchParams([...searchParams]);
    params.set(name, value);
    params.set("page", 1);
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  return (
    <div className="search_page inter-regular">
      <div className="page_header">
        <span className="montserrat-alternates-medium header1">Пошук</span>
        <div className="line" />
      </div>

      <div className="section">
        <div className="search_container">
          <div className="div">
            <input
              type=""
              name="search"
              placeholder="Назва чи інгредієнти (,)"
              defaultValue={searchParams.get("search") || ""}
            />
            <SearchIcon className="icon" onClick={handleSearchSubmit} />
          </div>
          <select
            name="stype"
            id=""
            className=""
            onChange={handleSearchTypeChange}
            defaultValue={searchParams.get("stype") || "name"}
          >
            <option value="name">Назва</option>
            <option value="ingredients">Інгредієнти</option>
          </select>
        </div>
      </div>

      <div className="section">
        {searchItems.length !== 0 ? (
          <SearchList search={searchItems} />
        ) : (
          <div className="montserrat-alternates-bold header2 nothing ">
            Нічого не знайдено
          </div>
        )}
        {totalItems > itemsPerPage && <Pagination totalPages={totalPages} />}
      </div>
      <div className="section"></div>
    </div>
  );
}
