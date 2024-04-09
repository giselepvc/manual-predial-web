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
}

const Action = ({ title }: ActionProps) => {
  return (
    <FilterRow>
      <FilterSection>
        <FilterButton>
          <SearchIcon />
        </FilterButton>
        <FilterInput placeholder="Insira uma informação" />
      </FilterSection>

      <FilterRegister>
        <PlusIcon />
        {title}
      </FilterRegister>
    </FilterRow>
  );
};

export default Action;
