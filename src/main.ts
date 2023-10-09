import { registerControls } from "./controls";
import { registerListeners } from "./listeners";
import "./style.css";

const audios = registerListeners();

registerControls(audios);
