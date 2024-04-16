import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
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
  setSearch?: Dispatch<SetStateAction<string>>;
  notFilter?: boolean;
}

const Action = ({ title, href, setSearch, notFilter }: ActionProps) => {
  const { push } = useRouter();

  const handleNavigation = () => {
    if (href) {
      push(href);
    }
  };

  return (
    <FilterRow>
      {!notFilter && (
        <FilterSection>
          <FilterButton>
            <SearchIcon />
          </FilterButton>
          <FilterInput
            placeholder="Insira uma informação"
            onBlur={e => setSearch && setSearch(e.target.value)}
          />
        </FilterSection>
      )}

      <FilterRegister onClick={handleNavigation}>
        <PlusIcon />
        {title}
      </FilterRegister>
    </FilterRow>
  );
};

export default Action;
