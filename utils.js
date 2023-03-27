module.exports = {
  name: "utils",

  currentDay(language) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    if (language === "fi") {
      return dd + "-" + mm + "-" + yyyy;
    }
    if (language === "en" || language === undefined) {
      return yyyy + "-" + mm + "-" + dd;
    }

    return yyyy + "-" + mm + "-" + dd;
  },
  previousDay(language) {
    let today = new Date();
    let dd = String(today.getDate() - 1).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();

    if (language === "fi") {
      return dd + "-" + mm + "-" + yyyy;
    }
    if (language === "en" || language === undefined) {
      return yyyy + "-" + mm + "-" + dd;
    }

    return yyyy + "-" + mm + "-" + dd;
  },
};
