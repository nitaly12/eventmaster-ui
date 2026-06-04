import { popularData } from "./popularData";

const categoryNames = [
  "Music",
  "Conference",
  "Sports",
  "Workshop",
  "Social",
  "Motorsport",
];

export const allCategory = {
  payload: categoryNames.map((name) => ({
    title: name,
    payload: popularData.payload.filter((event) => event.categoryName === name),
  })),
};
