import { getCurrentUserServer } from '@/services/server';
import HeaderInteractive from './HeaderInteractive';

const Header = async () => {
  const user = await getCurrentUserServer();
  return <HeaderInteractive user={user} />;
};

export default Header;
