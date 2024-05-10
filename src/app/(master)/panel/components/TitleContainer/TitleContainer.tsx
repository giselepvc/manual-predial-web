import { ContainerData } from '@/interfaces/content';
import { TitlesDatum } from '@/interfaces/manual';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { Dispatch, SetStateAction } from 'react';
import {
  IconArrow,
  InfoSection,
  TableMore,
  Thread,
  ThreadLine,
  ThreadSection,
} from './styles';

interface TitleProps {
  setSubContent: Dispatch<SetStateAction<Recursive<ContainerData> | undefined>>;
  getContent: (id: number) => void;
  selected: Recursive<TitlesDatum> | undefined;
  title: Recursive<TitlesDatum> | undefined;
  index: number;
  setSelected: Dispatch<SetStateAction<Recursive<TitlesDatum> | undefined>>;
}

const TitleContainer = ({
  selected,
  title,
  index,
  setSubContent,
  getContent,
  setSelected,
}: TitleProps) => {
  return (
    <Thread
      onClick={() => {
        if (title?.containers?.[0]?.type === 'abas') {
          setSubContent(undefined);
          getContent(title?.containers?.[0]?.id);
        }
      }}
    >
      <ThreadSection>{index + 1 === 1 && <ThreadLine />}</ThreadSection>
      <TableMore
        key={selected?.id}
        selected={title?.id === selected?.id}
        onClick={() =>
          setSelected(props => (props === title ? undefined : title))
        }
      >
        <InfoSection>
          <div>{title?.title?.toUpperCase() || ''}</div>
        </InfoSection>
        <IconArrow
          src={
            title?.id === selected?.id
              ? '/icons/up-arrow.svg'
              : '/icons/down-arrow.svg'
          }
          alt="icon"
        />
      </TableMore>
    </Thread>
  );
};

export default TitleContainer;
