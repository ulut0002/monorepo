import {
  configureJwtStrategy,
  login,
  register,
  me,
  logout,
} from "./authentication.controller";
import { getApiInfo } from "./root.controller";

export { register, login, configureJwtStrategy, getApiInfo, logout, me };
