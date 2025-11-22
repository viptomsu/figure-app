import { getCurrentUserServer, getAllCategoriesServer } from '@/services/server';
import HeaderInteractive from './HeaderInteractive';

const Header = async () => {
  const user = await getCurrentUserServer();
  const categoriesData = await getAllCategoriesServer(1, 1000);

  return <HeaderInteractive user={user} categories={categoriesData.content} />;
};

export default Header;
