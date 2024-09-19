export const calcCookTime = (totalMinutes) => {
  if (totalMinutes === 0) return "0 хвилин";

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  let result = "";

  if (days > 0) {
    if (days === 1) {
      result += `${days} день`;
    } else {
      result += `${days} днів`;
    }
  }

  if (hours > 0) {
    if (hours === 1) {
      result += `${hours} година `;
    } else if (hours > 2 && hours < 5) {
      result += `${hours} години`;
    } else {
      result += `${hours} годин`;
    }
  }

  if (minutes > 0) {
    if (minutes === 1) {
      result += `${minutes} хвилина `;
    } else if (minutes > 2 && minutes < 5) {
      result += `${minutes} хвилини`;
    } else {
      result += `${minutes} хвилин`;
    }
  }

  return result.trim();
};

export const transformRecipeDifficulty = (difficulty) => {
  if (difficulty === "Easy") {
    return "Легко";
  } else if (difficulty === "Medium") {
    return "Помірно";
  } else {
    return "Складно";
  }
};

export const convertStatus = (status, userId) => {
  switch (status) {
    case "Private":
      return {
        name: "Приватний",
        color: "#0A7077",
        refer: "/profile/private/",
        stars: false,
      };
    case "Public":
      return {
        name: "Публічний",
        color: "#2CA5A5",
        refer: `/cook/${userId}/recipes/`,
        stars: false,
      };
    case "Submitted":
      return {
        name: "Запропонований",
        color: "#57C8A1",
        refer: `/cook/${userId}/recipes/`,
        stars: false,
      };
    case "Rejected":
      return {
        name: "Відхилений",
        color: "#E70000",
        refer: `/cook/${userId}/recipes/`,
        stars: false,
      };
    case "Approved":
      return {
        name: "Розміщений",
        color: "#106B4A",
        refer: `/recipes/`,
        stars: true,
      };
  }
};

export const convertReviewsCount = (count) => {
  if (count === 0) {
    return "Без відгуків";
  } else if (count === 1) {
    return count.toString() + " відгук";
  } else if (count > 1 && count < 5) {
    return count.toString() + " відгуки";
  } else {
    return count.toString() + " відгуків";
  }
};

export const convertMinutes = (minutes, measure) => {
  let result = {};

  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor(minutes / 60);
  const Rminutes = minutes

  if (measure === "дні") {
    result = { value: days, unit: "дні" };
  }
  if (measure === "години") {
    result = { value: hours, unit: "години" };
  }
  if (measure === "хвилини") {
    result = { value: Rminutes, unit: "хвилини" };
  }
  
  return result;
};

export const transformMeasure = (difficulty) => {
  if (difficulty === "minutes") {
    return "хвилини";
  } else if (difficulty === "hours") {
    return "години";
  } else {
    return "дні";
  }
};
