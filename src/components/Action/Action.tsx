import { useRouter } from 'next/navigation';
import SearchIcon from '../../../public/icons/search.svg';
import PlusIcon from '../../../public/icons/plus.svg';
import {
  FilterButton,
  FilterInput,
  FilterRegister,
  FilterRow,
  FilterSection,
} from './styles';

interface ActionProps {
  title?: string;
  href?: string;
}

const Action = ({ title, href }: ActionProps) => {
  const { push } = useRouter();

  const handleNavigation = () => {
    if (href) {
      push(href);
    }
  };

  return (
    <FilterRow>
      <FilterSection>
        <FilterButton>
          <SearchIcon />
        </FilterButton>
        <FilterInput placeholder="Insira uma informação" />
      </FilterSection>

      <FilterRegister onClick={handleNavigation}>
        <PlusIcon />
        {title}
      </FilterRegister>
    </FilterRow>
  );
};

export default Action;
