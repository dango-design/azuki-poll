export type PollOption = {
  id: string;
  name: string;
  image: string;
};

export const POLL_OPTIONS: PollOption[] = [
  { id: "19", name: "Strawberry daifuku",                 image: "/options/19.png" },
  { id: "20", name: "Peanut butter red bean cookie",      image: "/options/20.png" },
  { id: "21", name: "Chocolate red bean matcha cookie",   image: "/options/21.png" },
  { id: "22", name: "Matcha red bean coffee cake",        image: "/options/22.png" },
  { id: "23", name: "Black sesame milk bread roll",       image: "/options/23.png" },
  { id: "24", name: "Salt bread",                         image: "/options/24.png" },
  { id: "25", name: "Hokkaido-inspired cheese tart",      image: "/options/25.png" },
];

export const OPTIONS_BY_ID = new Map(POLL_OPTIONS.map((o) => [o.id, o]));
