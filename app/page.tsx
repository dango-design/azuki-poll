import { POLL_OPTIONS } from "@/lib/options";
import PollPicker from "./PollPicker";

export default function Home() {
  return <PollPicker options={POLL_OPTIONS} />;
}
