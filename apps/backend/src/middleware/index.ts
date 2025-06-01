// Re-exporting the `ensureBody` middleware function from the request.middleware file.
// This allows other parts of the app to import it from this index instead of directly from the file path.
import { ensureBody } from "./request.middleware";

export { ensureBody };
