import { useSelector } from '../services/store';
import { RootState } from '../services/store';

export const TestRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user?.user);
  console.log('TestRoute user:', user);
  return <>{children}</>;
};
