import { useRef } from 'react';
import { CaptersDatum } from '@/interfaces/manual';
import { RecursiveNormalize } from '@/utils/normalizeStrapi';
import { FaCompressArrowsAlt, FaDownload } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { TableRow, InfoSection } from './styles';
import { Hidden } from '../../styles';
import DocComponent from './DocComponents/Doc';

interface ChapterContainerProps {
  chapter: RecursiveNormalize<CaptersDatum[]> | undefined;
}

const ManualMap = ({ chapter }: ChapterContainerProps) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current as HTMLDivElement,
  });

  return (
    <>
      <TableRow key="manual_map" onClick={handlePrint}>
        <InfoSection>
          <FaCompressArrowsAlt size={20} color="white" />
          <div>MAPA DO MANUAL</div>
        </InfoSection>
        <FaDownload size={20} color="white" />
      </TableRow>

      {chapter && chapter?.length > 0 && (
        <Hidden>
          <DocComponent ref={componentRef} chapter={chapter} />
        </Hidden>
      )}
    </>
  );
};

export default ManualMap;
