export const transformUserLevel = (level) => {
    if (level === "Amateur") {
      return "Аматор";
    } else if (level === "Home Cook") {
      return "Любитель";
    } else {
      return "Експерт";
    }
  };