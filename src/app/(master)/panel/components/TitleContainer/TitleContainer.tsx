import { Dispatch, SetStateAction } from 'react';

import { TitlesDatum, ContainerData } from '@/interfaces/manual';
import { RecursiveNormalize as R } from '@/utils/normalizeStrapi';

import {
  IconArrow,
  InfoSection,
  TableMore,
  Thread,
  ThreadLine,
  ThreadSection,
} from './styles';

interface TitleProps {
  index: number;
  selected: R<TitlesDatum> | undefined;
  title: R<TitlesDatum> | undefined;
  setSubContent: Dispatch<SetStateAction<R<ContainerData> | undefined>>;
  setSelected: Dispatch<SetStateAction<R<TitlesDatum> | undefined>>;
}

const TitleContainer = ({
  index,
  selected,
  title,
  setSubContent,
  setSelected,
}: TitleProps) => {
  const hasSelected = title?.id === selected?.id;
  const hasAbas = title?.containers?.[0]?.type === 'abas';

  const handleSubContent = () => {
    const id = title?.containers?.[0]?.id;

    if (id && hasAbas && !hasSelected) {
      setSubContent(undefined);
    }
  };

  const handleSelect = () => {
    setSelected(props => (props === title ? undefined : title));
  };

  const imageUrl = hasSelected
    ? '/icons/up-arrow.svg'
    : '/icons/down-arrow.svg';

  return (
    <Thread onClick={handleSubContent}>
      <ThreadSection>{index + 1 === 1 && <ThreadLine />}</ThreadSection>
      <TableMore key={index} selected={hasSelected} onClick={handleSelect}>
        <InfoSection>
          <div>{title?.title?.toUpperCase() || ''}</div>
        </InfoSection>
        <IconArrow src={imageUrl} alt="icon" />
      </TableMore>
    </Thread>
  );
};

export default TitleContainer;
