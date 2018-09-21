import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

// eslint-disable-next-line
let Authorized = RenderAuthorized(getAuthority());

// 更新权限
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};

export { reloadAuthorized };
export default Authorized;
