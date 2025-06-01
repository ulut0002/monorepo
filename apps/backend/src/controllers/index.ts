import {
  configureJwtStrategy,
  login,
  register,
} from "./authentication.controller";
import { getApiInfo } from "./root.controller";

export { register, login, configureJwtStrategy, getApiInfo };
