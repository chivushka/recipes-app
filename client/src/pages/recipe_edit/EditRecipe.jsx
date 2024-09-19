import React, { createElement, useEffect, useState } from "react";
import "./EditRecipe.scss";
import FormInput from "../../components/form/input_form/FormInput";
import FormTextarea from "../../components/form/textarea_form/FormTextarea";
import FormDefaultInput from "../../components/form/form_default_input/FormDefaultInput.jsx";
import { makeRequest } from "../../axi.js";
import FormSelect from "../../components/form/form_select/FormSelect.jsx";
import useAuthStore from "../../stores/authStore.jsx";
import FormImgInput from "../../components/form/form_img_input/FormImgInput.jsx";
import FormRadioButtonGroup from "../../components/form/form_radio_button_group/FormRadioButtonGroup.jsx";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FormMultipleSelect } from "../../components/form/form_multiple_select/FormMultipleSelect.jsx";
import Edit from "@mui/icons-material/EditNoteOutlined";
import { convertMinutes } from "../../utils/recipeUtils.jsx";

export default function EditRecipe({ type }) {
  const { currentUser, isAdmin } = useAuthStore();

  const [recipe, setRecipe] = useState();

  const [ingredients, setIngredients] = useState([]);
  const [ingredientId, setIngredientId] = useState(1);
  const [steps, setSteps] = useState([]);
  const [stepId, setStepId] = useState(1);
  const [fetch, setFetch] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);

  const [time, setTime] = useState({});
  const [catIds, setCatIds] = useState([]);

  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [fetch]);

  useEffect(() => {
    fetchRecipeById(categories);
  }, [categories]);

  useEffect(() => {
    if (recipe && recipe.userId===currentUser.id && recipe.status === "Approved" && !isAdmin) {
      navigate("/profile/my_recipes");
    }
  }, [recipe]);

  const fetchData = async () => {
    try {
      window.scrollTo({ top: 0, left: 0 });
      const cuisinesResponse = await makeRequest.get("/cuisines/getall");
      setCuisines(cuisinesResponse.data);
    } catch (err) {
      console.error(err);
    }
    try {
      const categoriesResponse = await makeRequest.get("/categories/getall");
      setCategories(categoriesResponse.data);

      console.log(categoriesResponse.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecipeById = async (categories) => {
    try {
      let qparams = {};
      if (type == "admin") {
        qparams = { id: params.recipeId };
      } else {
        qparams = { id: params.recipeId, userId: currentUser.id };
      }
      const response = await makeRequest.get("/recipes/one", {
        params: qparams,
      });
      setRecipe(response.data);
      console.log(response.data);
      const fetchedIngredients = [];
      let i = 1;
      for (let ingredient of response.data.ingredients) {
        const newIngredient = {
          id: i,
          ingredient: (
            <FormDefaultInput
              key={i}
              id={i}
              name={"ingredient" + i}
              placeholder={"Інгредієнт, кількість"}
              {...formElements[2]}
              defaultValue={ingredient.text}
              onDelete={deleteIngredient}
            />
          ),
        };
        fetchedIngredients.push(newIngredient);
        setIngredientId((stepId) => stepId + 1);
        i++;
      }
      setIngredients(fetchedIngredients);
      i = 1;
      const fetchedSteps = [];
      for (let step of response.data.directions) {
        const newStep = {
          id: i,
          step: (
            <FormDefaultInput
              key={i}
              id={i}
              stepid={step.id}
              name={"step" + i}
              placeholder={"Введіть крок"}
              defaultValue={step.text}
              img={step.img}
              {...formElements[3]}
              onDelete={deleteStep}
            />
          ),
        };
        fetchedSteps.push(newStep);
        setStepId((stepId) => stepId + 1);
        i++;
      }
      setSteps(fetchedSteps);
      const categoryIds = [];
      for (let cat of response.data.categories) {
        categoryIds.push(cat.categoryId);
      }
      setSelectedCategories(findCategoryNamesByIds(categoryIds, categories));
      setTime(convertMinutes(response.data.cookTime, response.data.tmeasure));
    } catch (error) {
      console.log("Failed to fetch recipe:", error);
    }
  };

  const deleteIngredient = (id) => {
    console.log("delete ingred", id);
    setIngredients((ingredients) =>
      ingredients.filter((item) => item.id !== id)
    );
  };

  const addIngredient = (e) => {
    e.preventDefault();
    const newIngredient = {
      id: ingredientId,
      ingredient: (
        <FormDefaultInput
          key={ingredientId}
          id={ingredientId}
          name={"ingredient" + ingredientId}
          placeholder={"Інгредієнт, кількість"}
          {...formElements[2]}
          onDelete={deleteIngredient}
        />
      ),
    };

    setIngredients((ingredients) => [...ingredients, newIngredient]);
    setIngredientId((ingredientId) => ingredientId + 1);
  };

  const deleteStep = (id) => {
    setSteps((steps) => steps.filter((item) => +item.id !== +id));
  };

  const addStep = (e) => {
    e.preventDefault();
    const newStep = {
      id: stepId,
      step: (
        <FormDefaultInput
          key={stepId}
          id={stepId}
          name={"step" + stepId}
          placeholder={"Введіть крок"}
          {...formElements[3]}
          onDelete={deleteStep}
        />
      ),
    };

    setSteps((steps) => [...steps, newStep]);
    setStepId((stepId) => stepId + 1);
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(document.getElementById("recipe_form"));
    const entries = Object.fromEntries(data.entries());
    console.log(entries);

    try {
      //визначення id кухні світу
      const cuisine = cuisines.filter((item) => item.name === entries.cuisine);
      const cuisineId = cuisine[0].id;

      //відокремлення інформації про рецепт, кроки та інгредієнти
      const recipeInfo = {};

      const directions = [];
      const steps = {};

      const ingredients = [];
      const ingreds = {};

      let time, measure;

      Object.entries(entries).forEach(([key, value]) => {
        const index = key.match(/\d+/)?.[0];
        switch (true) {
          case key.startsWith("imgstep"):
            if (!steps[index]) steps[index] = {};
            if (value.name !== "") {
              steps[index].file = value;
            }
            break;
          case key.startsWith("pimgstep"):
            if (!steps[index]) steps[index] = {};
            steps[index].pimg = value;
            break;
          case key.startsWith("idstep"):
            if (!steps[index]) steps[index] = {};
            steps[index].id = value;
            break;
          case key.startsWith("step"):
            if (!steps[index]) steps[index] = {};
            steps[index].text = value;
            break;
          case key.startsWith("ingredient"):
            if (!ingreds[index]) ingreds[index] = {};
            ingreds[index].text = value;
            break;
          case key.startsWith("measure"):
            recipeInfo[key] = value;
            measure = value;
            break;
          case key.startsWith("time"):
            time = value;
            break;
          case key.startsWith("cuisine"):
            recipeInfo["cuisineId"] = cuisineId;
            break;
          case key.startsWith("imgrecipe"):
            if (value.name !== "") {
              recipeInfo["file"] = value;
            }
            break;
          default:
            recipeInfo[key] = value;
            break;
        }
      });

      if (measure === "години") {
        recipeInfo["cookTime"] = time * 60;
      } else if (measure === "дні") {
        recipeInfo["cookTime"] = time * 3600;
      } else {
        recipeInfo["cookTime"] = time;
      }

      recipeInfo["username"] = currentUser.name;

      for (const key in steps) {
        directions.push(steps[key]);
      }

      for (const key in ingreds) {
        ingredients.push(ingreds[key]);
      }

      const cats = categories.filter((category) =>
        selectedCategories.includes(category.name)
      );

      console.log({ directions, ingredients, recipeInfo, cats });

      try {
        //оновлення рецепту
        try {
          if (recipeInfo.file !== "NULL") {
            const res = await upload(recipeInfo.file);
            recipeInfo.img = res;
          } else {
            recipeInfo.img = "NULL";
          }
          await updateRecipe(recipeInfo);
        } catch (err) {
          console.error(err);
        }

        for (const element of directions) {
          console.log(directions);
          if (element.file) {
            try {
              const res = await upload(element.file);
              element.img = res;
            } catch (err) {
              console.error(err);
            }
          } else {
            element.img = element.pimg;
          }
        }
        console.log("this dirs", directions);

        await updateCategories(params.recipeId, cats);
        await updateDirections(params.recipeId, directions);
        await updateIngredients(params.recipeId, ingredients);
        setFetch(!fetch);
      } catch (err) {
        console.error("Failed to add recipe", err);
      }
      if (type == "admin") {
        navigate("/admin/recipes");
      } else {
        navigate("/profile/my_recipes");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateRecipe = async (recipeInfo) => {
    try {
      const res = await makeRequest.patch(
        `/recipes/?userId=${currentUser.id}&recipeId=${params.recipeId}`,
        recipeInfo
      );
      const recipeId = res.data.insertId;
      return recipeId;
    } catch (err) {
      console.error(err);
    }
  };
  const updateCategories = async (recipeId, categories) => {
    try {
      const res = await makeRequest.patch(
        `/categories/?recipeId=${recipeId}&userId=${currentUser.id}`,
        { categories }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateIngredients = async (recipeId, ingredients) => {
    try {
      const res = await makeRequest.patch(
        `/ingredients/?recipeId=${recipeId}&userId=${currentUser.id}`,
        { ingredients }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateDirections = async (recipeId, directions) => {
    try {
      const res = await makeRequest.patch(
        `/directions/?recipeId=${recipeId}&userId=${currentUser.id}`,
        { directions }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  const findCuisineNameById = (id) => {
    const cuisine = cuisines.find((cuisine) => cuisine.id === id);
    if (cuisine) {
      return cuisine.name;
    } else {
      console.error(`Cuisine with id ${id} not found`);
      return null;
    }
  };

  const findCategoryNamesByIds = (ids, categories) => {
    const categoryNames = [];
    for (let id of ids) {
      const category = categories.find((category) => category.id == id);
      if (category) {
        categoryNames.push(category.name);
      }
    }
    return categoryNames;
  };
  const formElements = [
    {
      // id: 0,
      name: "title",
      type: "text",
      placeholder: "Дайте своєму рецепту назву",
      errorMessage: "Назва має бути довжиною 3-300 символів",
      label: "Назва",
      labelcolor: "black",
      pattern: "^.{3,100}$",
      required: true,
      defaultValue: recipe && recipe.title,
    },
    {
      // id: 1,
      name: "intro",
      type: "text",
      placeholder:
        "Поділіться історією вашого рецепту та тим, що робить його особливим.",
      errorMessage: "Вступ має бути довжиною 3-300 символів",
      label: "Вступ",
      minLength: "3",
      maxLength: "400",
      required: true,
      defaultValue: recipe && recipe.intro,
    },
    {
      // id: 2,
      type: "text",
      errorMessage: "Інгредієнт має бути довжиною 3-100 символів",
      pattern: "^(?!.*;).{3,50}$",
      required: true,
    },
    {
      // id: 3,
      images: true,
      type: "text",
      errorMessage: "Кpок має бути довжиною 3-500 символів",
      pattern: "^.{3,300}$",
      required: true,
    },
    {
      // id: 4,
      name: "cuisine",
      defaultValue: recipe && findCuisineNameById(recipe.cuisineId),
      label: "Оберіть кухню світу",
      required: true,
      opts: cuisines,
    },
    {
      // id: 5,
      type: "number",
      min: 1,
      name: "servings",
      label: "Порції",
      placeholder: "8",
      defaultValue: recipe && recipe.servings,
      required: true,
      errorMessage: "Введіть кількість порцій",
    },
    {
      // id: 6,
      type: "number",
      min: 1,
      name: "time",
      label: "Час приготування",
      placeholder: "8",
      defaultValue: time && time.value,
      required: true,
      errorMessage: "Введіть час приготування",
    },
    {
      // id: 7,
      name: "measure",
      label: "Вимір",
      defaultValue: time && time.unit,
      opts: [
        {
          id: 0,
          name: "хвилини",
          value: "хвилини",
        },
        {
          id: 1,
          name: "години",
          value: "години",
        },
        {
          id: 2,
          name: "дні",
          value: "дні",
        },
      ],
    },
    {
      // id: 8,
      name: "difficulty",
      label: "Оберіть складність",
      defaultValue: recipe && recipe.difficulty,
      opts: [
        {
          id: 0,
          name: "Easy",
          value: "Легко",
        },
        {
          id: 1,
          name: "Medium",
          value: "Помірно",
        },
        {
          id: 2,
          name: "Hard",
          value: "Складно",
        },
      ],
    },
    {
      // id: 9,
      name: "addinfo",
      defaultValue: recipe && recipe.addInfo,
      type: "text",
      placeholder:
        "Додайте інформацію для адміністратора. Наприклад, якщо ви не знайшли потрібну кухню, зазначте це тут.",
      errorMessage:
        "Максимальна кількість символів додаткової інформації - 400.",
      maxLength: "400",
    },
    {
      // id: 10,
      name: "imgrecipe",
      img: recipe && recipe.img,
    },
    {
      // id: 11,
      name: "status",
      selectedOpt: recipe && recipe.status,
      opts: [
        {
          id: 0,
          name: "Додати в Приватні Рецепти",
          value: "Private",
          info: "Ніхто не побачить цей рецепт окрім тебе.",
          required: true,
        },
        {
          id: 1,
          name: "Додати в Публічні Рецепти",
          value: "Public",
          info: "Інші користувачі зможуть побачити цей рецепт у твоєму профілі.",
          required: true,
        },
        {
          id: 2,
          name: "Запропонувати для публікації",
          value: "Submitted",
          info: "Цей рецепт буде відображений у профілі, та опублікований після перевірки.",
          required: true,
        },
        // (type=="admin" &&{
        //   id: 3,
        //   name: "Затвердити",
        //   value: "Approved",
        //   info: "Рецепт буде розміщено на веб-сайті.",
        //   required: true,
        // }),
        // (type=="admin" &&{
        //   id: 4,
        //   name: "Відхилити",
        //   value: "Rejected",
        //   info: "Рецепт потребує допрацювання.",
        //   required: true,
        // })
      ],
    },
  ];

  return (
    <div className="editrecipe_page">
      {recipe && (
        <form
          className="editrecipe_container"
          id="recipe_form"
          onSubmit={handleSubmit}
        >
          <div className="page_header">
            <div className="montserrat-alternates-medium header1 header">
              <Edit style={{ color: "#e70000", fontSize: "32px" }} /> Оновити
              рецепт
            </div>
          </div>
          <div className="section">
            <FormInput {...formElements[0]} />
            <FormTextarea {...formElements[1]} />
            <div className="sec_name">Додайте фото рецепту</div>
            <FormImgInput {...formElements[10]} img={recipe.img} />
            <FormSelect {...formElements[4]} />
            <div className="sec_name">Оберіть категорії для рецепту</div>
            <FormMultipleSelect
              selected={selectedCategories}
              setSelected={setSelectedCategories}
              options={categories}
              name={"categories"}
            />
          </div>
          <div className="section" id="ingredients">
            <div className="sec_name">Список інгредієнтів</div>
            <div className="sec_text">
              Введіть один інгредієнт на рядок. Вкажіть назву інгредієнту в
              однині та його кількість (у шт. ст.л. ч.л. склянках), через тире.
            </div>
            {ingredients.map((item) => item.ingredient)}
            <div
              className="add_sth_button"
              type="button"
              onClick={addIngredient}
            >
              Додати інгредієнт
            </div>
          </div>
          <div className="section" id="steps">
            <div className="sec_name">Кроки приготування</div>
            <div className="sec_text">
              Поясніть, як приготувати ваш рецепт, включаючи температуру
              духовки, час приготування або випікання, розміри форм для випічки
              тощо.
            </div>
            {steps.map((item) => item.step)}
            <div className="add_sth_button" type="button" onClick={addStep}>
              Додати крок
            </div>
          </div>
          <div className="section">
            <FormInput {...formElements[5]} />
          </div>
          <div className="section">
            <div className="twocols">
              <FormInput {...formElements[6]} />
              <FormSelect {...formElements[7]} />
            </div>
          </div>
          <div className="section">
            <FormSelect {...formElements[8]} />
          </div>
          <div className="section">
            <div className="sec_name">Оберіть що зробити з даним рецептом:</div>
            <FormRadioButtonGroup {...formElements[11]} />
          </div>
          <div className="section">
            <div className="sec_name">Додаткова інформація.</div>
            <div className="sec_text">
              Заповніть, якщо хочете запропонувати рецепт.
            </div>

            <FormTextarea {...formElements[9]} />
          </div>

          <button className="submit_button">Оновити</button>
        </form>
      )}
    </div>
  );
}
