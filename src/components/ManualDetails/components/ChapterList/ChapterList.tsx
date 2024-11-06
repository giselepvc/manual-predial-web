import { CaptersDatum, ContainerData } from '@/interfaces/manual';
import { RecursiveNormalize as Recursive } from '@/utils/normalizeStrapi';
import { urlBuild } from '@/utils/urlBuild';
import { Dispatch, SetStateAction } from 'react';
import { TableRow, InfoSection, IconArrow } from './styles';

interface ChapterContainerProps {
  chapter: Recursive<CaptersDatum> | undefined;
  selected: Recursive<CaptersDatum> | undefined;
  setSelected: Dispatch<SetStateAction<Recursive<CaptersDatum> | undefined>>;
  setSubContent: Dispatch<SetStateAction<Recursive<ContainerData> | undefined>>;
}

const ChapterList = ({
  chapter,
  selected,
  setSelected,
  setSubContent,
}: ChapterContainerProps) => {
  return (
    <TableRow
      key={chapter?.id}
      selected={selected?.id === chapter?.id}
      onClick={() => {
        setSelected(selected === chapter ? undefined : chapter);
        setSubContent(undefined);
      }}
    >
      <InfoSection>
        <IconArrow
          src={
            chapter?.icon?.image?.url
              ? urlBuild(chapter?.icon.image.url)
              : '/icons/image.svg'
          }
          alt="icon"
          width={20}
          height={20}
        />
        <div>{chapter?.title}</div>
      </InfoSection>
      <IconArrow
        src={
          selected?.id === chapter?.id
            ? '/icons/up-arrow.svg'
            : '/icons/down-arrow.svg'
        }
        alt="icon"
        width={20}
        height={20}
      />
    </TableRow>
  );
};

export default ChapterList;
