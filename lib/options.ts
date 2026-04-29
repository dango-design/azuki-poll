export type PollOption = {
  id: string;
  name: string;
  meta: string;
  image: string;
};

export const POLL_OPTIONS: PollOption[] = [
  { id: "19", name: "Strawberry tartlets",       meta: "Bite-size, fresh berries", image: "/options/rectangle-19.png" },
  { id: "20", name: "Double chocolate cookies",  meta: "Soft-baked, sea salt",     image: "/options/rectangle-20.png" },
  { id: "21", name: "Chocolate crinkles",        meta: "Powdered sugar coated",    image: "/options/rectangle-21.png" },
  { id: "22", name: "Crumb cake squares",        meta: "Cinnamon streusel top",    image: "/options/rectangle-22.png" },
  { id: "23", name: "Chocolate cinnamon rolls",  meta: "Warm, glazed",             image: "/options/rectangle-23.png" },
  { id: "24", name: "Brioche buns",              meta: "Buttery, golden",          image: "/options/rectangle-24.png" },
  { id: "25", name: "Glazed palmiers",           meta: "Flaky, lightly sweet",     image: "/options/rectangle-25.png" },
];

export const OPTIONS_BY_ID = new Map(POLL_OPTIONS.map((o) => [o.id, o]));
