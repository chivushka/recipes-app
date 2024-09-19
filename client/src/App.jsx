import { useContext, useState } from "react";
import "./App.scss";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Recipes from "./pages/recipes/Recipes.jsx";
import NotFoundPage from "./pages/notfoundpage/NotFoundPage.jsx";
import Recipe from "./pages/recipe/Recipe.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Cuisine from "./pages/cuisine/Cuisine.jsx";
import Cuisines from "./pages/cuisines/Cuisines.jsx";
import About from "./pages/about/About.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import AboutMe from "./pages/profile/about_me/AboutMe.jsx";
import ProfileMenu from "./components/profile_menu/ProfileMenu.jsx";
import SavedRecipes from "./pages/profile/saved_recipes/SavedRecipes.jsx";
import RecipeProfile from "./pages/profile/recipe_profile/RecipeProfile.jsx";
import RecipesCollections from "./pages/profile/recipes_collections/RecipesCollections.jsx";
import Settings from "./pages/profile/settings/Settings.jsx";
import useAuthStore from "./stores/authStore.jsx";
import AddRecipe from "./pages/recipe_add/AddRecipe.jsx";
import EditRecipe from "./pages/recipe_edit/EditRecipe.jsx";
import MyRecipes from "./pages/profile/my_recipes/MyRecipes.jsx";
import { Button, ConfigProvider, Space } from "antd";
import Search from "./pages/search/Search.jsx";
import CookProfile from "./pages/cookProfile/CookProfile.jsx";
import CookShowAll from "./pages/cookShowAll/CookShowAll.jsx";
import NotFound from "./components/notfound/NotFound.jsx";
import AdminMenu from "./components/admin_menu/AdminMenu.jsx";
import AdminUsers from "./pages/admin/admin_users/AdminUsers.jsx";
import AdminUsersEdit from "./pages/admin/admin_users/AdminUsersEdit.jsx";
import AdminCuisines from "./pages/admin/admin_cuisines/AdminCuisines.jsx";
import AdminCuisinesEdit from "./pages/admin/admin_cuisines/AdminCuisinesEdit.jsx";
import AdminCuisinesAdd from "./pages/admin/admin_cuisines/AdminCuisinesAdd.jsx";
import AdminRecipes from "./pages/admin/admin_recipes/AdminRecipes.jsx";
import AdminSubmittedRecipes from "./pages/admin/admin_recipes/AdminSubmitedRecipes.jsx";
import AdminReмviews from "./pages/admin/admin_reviews/AdminReviews.jsx";
import AdminReviews from "./pages/admin/admin_reviews/AdminReviews.jsx";
import AdminMain from "./pages/admin/main/AdminMain.jsx";

const Layout = () => {
  return (
      <div >
        <Navbar />
        <Outlet className="outlet"/>
        <Footer />
      </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser} = useAuthStore();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

const ProtectedRouteAdmin = ({ children }) => {
  const { currentUser, isAdmin } = useAuthStore();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

const router = createBrowserRouter([
  // Основний маршрут для головної сторінки
  {
    path: "/",
    element: <Layout />,  
    errorElement: <NotFoundPage />,  
    children: [
      
      {
        path: "/",
        element: <Home />,  
      },
      {
        path: "/recipes",
        element: <Recipes />,
      },
      {
        path: "/recipes/:recipeId",
        element: <Recipe />,
      },
      {
        path: "/cuisines",
        element: <Cuisines />,
      },
      {
        path: "/cuisines/:cuisineId",
        element: <Cuisine />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/signin",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/cook/:id",
        element: <CookProfile />,
      },
      {
        path: "/cook/:id/ownrecipes",
        element: <CookShowAll />,
      },
      {
        path: "/cook/:id/saved",
        element: <CookShowAll type={"saved"} />,
      },
      {
        path: "/cook/:userId/recipes/:recipeId",
        element: <RecipeProfile type={"public"} />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/profile/private/:recipeId",
            element: <RecipeProfile type={"private"} />,
          },
          {
            path: "/profile/add_recipe",
            element: <AddRecipe />,
          },
          {
            path: "/profile/edit_recipe/:recipeId",
            element: <EditRecipe />,
          },
          {
            path: "/profile/about_me",
            element: (
              <div className="profile_layout_container">
                <ProfileMenu />
                <AboutMe />
              </div>
            ),
          },
          {
            path: "/profile/my_recipes",
            element: (
              <div className="profile_layout_container">
                <ProfileMenu />
                <MyRecipes />
              </div>
            ),
          },
          {
            path: "/profile/saved_recipes",
            element: (
              <div className="profile_layout_container">
                <ProfileMenu />
                <SavedRecipes />
              </div>
            ),
          },
          {
            path: "/profile/recipes_collections",
            element: (
              <div className="profile_layout_container">
                <ProfileMenu />
                <RecipesCollections />
              </div>
            ),
          },
          {
            path: "/profile/settings",
            element: (
              <div className="profile_layout_container">
                <ProfileMenu />
                <Settings />
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/not_authorized",
    element: <NotFound text={"Тут нічого"} />,
  },
  {
    path: "/admin",
    errorElement: <NotFoundPage />,
    element: (
      <ProtectedRouteAdmin>
        <Outlet />
      </ProtectedRouteAdmin>
    ),
    children: [
      {
        path: "/admin/recipes/edit/:recipeId",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <EditRecipe type={"admin"} />
          </div>
        ),
      },
      {
        path: "/admin/",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminMain/>
          </div>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminUsers />
          </div>
        ),
      },
      {
        path: "/admin/users/edit/:userId",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminUsersEdit />
          </div>
        ),
      },
      {
        path: "/admin/cuisines",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminCuisines />
          </div>
        ),
      },
      {
        path: "/admin/cuisines/edit/:cuisineId",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminCuisinesEdit />
          </div>
        ),
      },
      {
        path: "/admin/cuisines/add",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminCuisinesAdd />
          </div>
        ),
      },
      {
        path: "/admin/recipes",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminRecipes />
          </div>
        ),
      },
      {
        path: "/admin/recipes/submitted",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminSubmittedRecipes />
          </div>
        ),
      },
      {
        path: "/admin/reviews",
        element: (
          <div className="admin_layout_container">
            <AdminMenu />
            <AdminReviews />
          </div>
        ),
      },
      
    ],
  },
]);

function App() {
  

  

  return (
    <>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
