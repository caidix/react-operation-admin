import { createBrowserHistory } from "history";
import { BrowserHistoryDecorator } from "./BrowserHistory";

const router = new BrowserHistoryDecorator(createBrowserHistory());

export default router;
