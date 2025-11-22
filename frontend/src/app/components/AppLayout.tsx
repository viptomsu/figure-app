import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import BackToTopBtn from '@/components/Other/BackToTopBtn';
import NavigationList from '@/components/Other/NavigationList';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTopBtn />
      <NavigationList />
    </>
  );
};

export default AppLayout;
