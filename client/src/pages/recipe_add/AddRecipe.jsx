import React, { createElement, useEffect, useState } from "react";
import "./AddRecipe.scss";
import PlusIcon from "@mui/icons-material/Add";
import FormInput from "../../components/form/input_form/FormInput";
import FormTextarea from "../../components/form/textarea_form/FormTextarea";
import FormDefaultInput from "../../components/form/form_default_input/FormDefaultInput.jsx";
import { makeRequest } from "../../axi.js";
import FormSelect from "../../components/form/form_select/FormSelect.jsx";
import useAuthStore from "../../stores/authStore.jsx";
import FormImgInput from "../../components/form/form_img_input/FormImgInput.jsx";
import FormRadioButtonGroup from "../../components/form/form_radio_button_group/FormRadioButtonGroup.jsx";
import { useNavigate } from "react-router-dom";
import { FormMultipleSelect } from "../../components/form/form_multiple_select/FormMultipleSelect.jsx";

export default function AddRecipe() {
  const { currentUser } = useAuthStore();

  const [ingredients, setIngredients] = useState([]);
  const [ingredientId, setIngredientId] = useState(1);
  const [steps, setSteps] = useState([]);
  const [stepId, setStepId] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    try {
      makeRequest.get("/cuisines/getall").then((res) => {
        return setCuisines(res.data);
      });
    } catch (err) {
      return console.log(err);
    }
    try {
      makeRequest.get("/categories/getall").then((res) => {
        return setCategories(res.data);
      });
    } catch (err) {
      return console.log(err);
    }
  }, []);

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
      const cuisine = await cuisines.filter(
        (item) => item.name === entries.cuisine
      );
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

        if (key.startsWith("imgstep")) {
          if (!steps[index]) steps[index] = {};
          if (value.name === "") {
            steps[index].file = "NULL";
          } else {
            steps[index].file = value;
          }
        } else if (key.startsWith("step")) {
          if (!steps[index]) steps[index] = {};
          steps[index].text = value;
        } else if (key.startsWith("ingredient")) {
          if (!ingreds[index]) ingreds[index] = {};
          ingreds[index].text = value;
        } else if (key.startsWith("measure")) {
          measure = value;
          recipeInfo[key] = value;
        } else if (key.startsWith("time")) {
          time = value;
        } else if (key.startsWith("cuisine")) {
          recipeInfo["cuisineId"] = cuisineId;
        } else if (key.startsWith("imgrecipe")) {
          if (value.name === "") {
            recipeInfo["file"] = "NULL";
          } else {
            recipeInfo["file"] = value;
          }
        } else {
          recipeInfo[key] = value;
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

      let recipeId;
      try {
        //додавання нового рецепту
        try {
          //завантаження картинки рецепту
          if (recipeInfo.file !== "NULL") {
            const res = await upload(recipeInfo.file);
            recipeInfo.img = res;
            console.log(recipeInfo);
          } else {
            recipeInfo.img = "NULL";
          }
          recipeId = await addRecipe(recipeInfo);
          console.log(recipeId);
        } catch (err) {
          console.error(err);
        }

        //завантаження файлів картинок для кроків та отримання їх назв
        for (const element of directions) {
          if (element.file !== "NULL") {
            try {
              const res = await upload(element.file);
              element.img = res;
            } catch (err) {
              console.error(err);
            }
          } else {
            element.img = "NULL";
          }
        }

        //додаємо категорії, кроки та інгредієнти
        await addCategories(recipeId, cats);
        await addDirections(recipeId, directions);
        await addIngredients(recipeId, ingredients);
      } catch (err) {
        console.error("Failed to add recipe", err);
      }

      navigate("/profile/my_recipes");
    } catch (err) {
      console.log(err);
    }
  }; //не забудь додати метод обробки категорій

  const addRecipe = async (recipeInfo) => {
    try {
      const res = await makeRequest.post(
        `/recipes/?userId=${currentUser.id}`,
        recipeInfo
      );
      const recipeId = res.data.insertId;
      return recipeId;
    } catch (err) {
      console.error(err);
    }
  };
  const addCategories = async (recipeId, categories) => {
    try {
      const res = await makeRequest.post(
        `/categories/addmany?recipeId=${recipeId}&userId=${currentUser.id}`,
        { categories }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addIngredients = async (recipeId, ingredients) => {
    try {
      const res = await makeRequest.post(
        `/ingredients/addmany?recipeId=${recipeId}&userId=${currentUser.id}`,
        { ingredients }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addDirections = async (recipeId, directions) => {
    try {
      const res = await makeRequest.post(
        `/directions/addmany?recipeId=${recipeId}&userId=${currentUser.id}`,
        { directions }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
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
    },
    {
      // id: 2,
      type: "text",
      errorMessage: "Інгредієнт має бути довжиною 3-100 символів",
      pattern: "^(?!.*;).{3,100}$",
      required: true,
    },
    {
      // id: 3,
      images: true,
      type: "text",
      errorMessage: "Кpок має бути довжиною 3-500 символів",
      pattern: "^.{3,500}$",
      required: true,
    },
    {
      // id: 4,
      name: "cuisine",
      defaultValue: "None",
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
      required: true,
      errorMessage: "Введіть час приготування",
    },
    {
      // id: 7,
      name: "measure",
      label: "Вимір",
      defaultValue: "minutes",
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
      defaultValue: "Легко",
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
      type: "text",
      placeholder:
        "Додайте інформацію для адміністратора. Наприклад, якщо ви не знайшли потрібну кухню, зазначте це тут.",
      minLength: 3,
      maxLength: 400,
    },
    {
      // id: 10,
      name: "imgrecipe",
    },
    {
      // id: 11,
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
      ],
    },
  ];

  return (
    <div className="addrecipe_page">
      <form
        className="addrecipe_container"
        id="recipe_form"
        onSubmit={handleSubmit}
      >
        <div className="page_header">
          <span className="montserrat-alternates-medium header1 header">
            <PlusIcon style={{ color: "#e70000", fontSize: "32px" }} /> Додати
            рецепт
          </span>
          <span className="desc">
            Завантажити власні рецепти - легко! Додавайте їх до обраного та
            діліться з друзями, родиною, чи навіть спільнотою Yumbook.
          </span>
        </div>
        <div className="section">
          <FormInput {...formElements[0]} />
          <FormTextarea {...formElements[1]} />
          <div className="sec_name">Додайте фото рецепту</div>
          <FormImgInput {...formElements[10]} />
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
            Введіть один інгредієнт на рядок. Вкажіть назву інгредієнту в однині
            та його кількість (у шт. ст.л. ч.л. склянках), через тире.
          </div>
          <FormDefaultInput
            id={0}
            placeholder={"просіяна мука - 2 склянки"}
            name={"ingredient" + 0}
            {...formElements[2]}
          />
          {ingredients.map((item) => item.ingredient)}
          <div className="add_sth_button" type="button" onClick={addIngredient}>
            Додати інгредієнт
          </div>
        </div>
        <div className="section" id="steps">
          <div className="sec_name">Кроки приготування</div>
          <div className="sec_text">
            Поясніть, як приготувати ваш рецепт, включаючи температуру духовки,
            час приготування або випікання, розміри форм для випічки тощо.
          </div>
          <FormDefaultInput
            id={0}
            placeholder={"Попередньо розігрійте духовку до 180"}
            name={"step" + 0}
            {...formElements[3]}
          />
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
            Заповніть, якщо хочете при пропонуванні рецепту
          </div>

          <FormTextarea {...formElements[9]} />
        </div>

        <button className="submit_button">Додати рецепт</button>
      </form>
    </div>
  );
}
